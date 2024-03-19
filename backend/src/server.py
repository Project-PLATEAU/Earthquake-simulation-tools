from typing import Optional, Any, Dict
from fastapi import FastAPI, HTTPException, File, Form, UploadFile, Header
from starlette.middleware.cors import CORSMiddleware
from mangum import Mangum
import psycopg
import psycopg.sql as sql
import datetime
from functools import lru_cache
from . import config
import json
import boto3
import os
from jwt.utils import base64url_decode
from fastapi import status
import requests
import jwt
import re
from botocore.client import Config
from src.schema.region_preset import (
    RegionPreset,
    RegionPresets,
    RegionPresetCreateRequestBody,
    RegionPresetCreateResponse,
    RegionPresetUpdateRequestBody,
    RegionPresetUpdateResponse
)
from src.schema.earthquake_preset import (
    EarthQuakePreset,
    EarthQuakePresets,
    EarthQuakePresetCreateRequestBody,
    EarthQuakePresetCreateResponse,
    EarthQuakePresetUpdateRequestBody,
    EarthQuakePresetUpdateResponse
)

from src.schema.simulation_reserve import (
    SimulationReserve,
    SimulationReserves,
    SimulationReserveCreateRequestBody,
    SimulationReserveCreateResponse,
    SimulationReserveUpdateRequestBody,
    SimulationReserveUpdateResponse
)
# 計算ステータス定数
CALC_STATUS_CALCULATING = 1
CALC_STATUS_CALCULATE_COMPLETE = 2
CALC_STATUS_CALCULATE_ERROR = 3
CALC_STATUS_VISUALIZING = 4
CALC_STATUS_VISUALIZE_COMPLETE = 5
CALC_STATUS_VISUALIZE_ERROR = 6

# 設定ファイル読み込み
@lru_cache()
def get_settings():
    return config.Settings()

# FastAPI app
_app = FastAPI()

# DB接続情報を取得
def get_conn():
    settings = get_settings()

    return psycopg.connect(
        host=settings.postgis_host,
        port=settings.postgis_port,
        dbname=settings.postgis_dbname,
        user=settings.postgis_user,
        password=settings.postgis_password
    )
    
def get_jwk_data(kid: str) -> dict:
    """JWKデータを取得する""" 
    settings = get_settings()
    COGNITO_USERPOOLID = settings.cognito_userpool_id
    jwks_url = f"https://cognito-idp.ap-northeast-1.amazonaws.com/{COGNITO_USERPOOLID}/.well-known/jwks.json"
    jwk_response = requests.get(jwks_url).json()
    return next((jwk_data for jwk_data in jwk_response['keys'] if jwk_data["kid"] == kid), {})

def decode_jwt_token(jwt_token: str, jwk_data: dict) -> dict:
    """JWTトークンをデコードする"""
    ALGORITHM = "RS256"
    settings = get_settings()
    COGNITO_USERPOOL_WEBCLIENTID = settings.cognito_userpool_webclient_id
    jwk_key = jwt.PyJWK(jwk_data, algorithm=ALGORITHM)
    return jwt.decode(jwt_token, jwk_key.key, algorithms=[ALGORITHM], audience=COGNITO_USERPOOL_WEBCLIENTID)

def verify_jwt(jwt_token: str) -> dict:
    """CognitoユーザープールのJWTの正当性をチェックし、payloadを取得する"""
    try:
        jwt_header = base64url_decode(jwt_token.split(".")[0])
        header_kid = json.loads(jwt_header)['kid']

        jwk_data = get_jwk_data(header_kid)
        payload = decode_jwt_token(jwt_token, jwk_data)
        
        return {"success": True, "payload": payload}
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}

def copy_all_keys_v2(source_bucket='', source_prefix='', target_bucket='', target_prefix='', dryrun=False):

  contents_count = 0
  next_token = ''

  s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))

  while True:
    if next_token == '':
      response = s3_client.list_objects_v2(Bucket=source_bucket, Prefix=source_prefix)
    else:
      response = s3_client.list_objects_v2(Bucket=source_bucket, Prefix=source_prefix, ContinuationToken=next_token)

    if 'Contents' in response:
      contents = response['Contents']
      contents_count = contents_count + len(contents)
      for content in contents:
        relative_prefix = re.sub('^' + source_prefix, '', content['Key'])
        if not dryrun:
          print('Copying: s3://' + source_bucket + '/' + content['Key'] + ' To s3://' + target_bucket + '/' + target_prefix + relative_prefix)
          s3_client.copy_object(Bucket=target_bucket, Key=target_prefix + relative_prefix, CopySource={'Bucket': source_bucket, 'Key': content['Key']})
        else:
          print('DryRun: s3://' + source_bucket + '/' + content['Key'] + ' To s3://' + target_bucket + '/' + target_prefix + relative_prefix)

    if 'NextContinuationToken' in response:
      next_token = response['NextContinuationToken']
    else:
      break

  print(f"contents_count:{contents_count}")

# region_presets
@_app.get("/region_presets", include_in_schema=True, tags=['region_preset'])
async def get_region_presets(page_num: int = 1, page_size: int = 10) -> RegionPresets:
    """
    登録済み地域プリセット一覧を取得する
    """
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            *
            FROM region_presets
            ORDER BY create_date desc
            LIMIT %s OFFSET %s
            """
            cur.execute(sql, (page_size, (page_num - 1) * page_size))
            row = cur.fetchall()
            print(row)
    if row == None:
        raise HTTPException(status_code=404, detail="No record.")

    region_presets: [RegionPreset] = []
    for item in row:
        region_presets.append(RegionPreset(
            id=item[0],
            name=item[1],
            geom=item[2],
            gmlfile_path=item[3],
            mesh_codes=item[4],
            additional_info=item[5],
            create_date=item[6].strftime('%Y/%m/%d %H:%M:%S'),
        ))

    return RegionPresets(
        total=len(region_presets),
        page=page_num,
        page_size=page_size,
        region_presets=region_presets
    )

@_app.get("/region_preset/{id}", include_in_schema=True, tags=['region_preset'])
async def get_region_preset(id: int) -> RegionPreset:
    """
    指定した地域プリセットを取得する
    """
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            id, name, mesh_codes,
            geom, gmlfile_path, additional_info,
            create_date
            FROM region_presets
            WHERE id = %s
            """
            try:
                cur.execute(sql, (id,))
                row = cur.fetchone()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")
    if row == None:
        raise HTTPException(status_code=404, detail="No record.")

    item = row

    region_preset = RegionPreset(
        id=item[0],
        name=item[1],
        mesh_codes=item[2],
        geom=item[3],
        gmlfile_path=item[4],
        additional_info=item[5],
        create_date=item[6].strftime('%Y/%m/%d %H:%M:%S')
    )
    return region_preset

@_app.post("/region_preset", include_in_schema=True, tags=['region_preset'], status_code=201)
async def post_region_preset(data: RegionPresetCreateRequestBody)->RegionPresetCreateResponse:
    """
    地域プリセットを登録する
    """
    # 登録したレコードのIDを取得するための変数
    id_of_new_row = None

    # 現在時刻を取得
    dt = datetime.datetime.now()
    create_date = dt.strftime('%Y-%m-%d %H:%M:%S')

    # TODO: geomを取得
    # 関連付けるメッシュ毎建物citygmlについて、
    # 先頭部分に存在するgml:boundedBy/gml:Envelope/gml:lowerCornerの値を取得
    # MULTIPOLYGONのWKTでまとめる

    # DBに接続・INSERT文を実行・コミット
    with get_conn() as conn:
        with conn.cursor() as cur:
            insert_sql = """
            INSERT INTO region_presets
            (name, mesh_codes, geom, gmlfile_path, additional_info, create_date)
            VALUES
            (%s, %s, %s, %s, %s, %s)
            RETURNING id;
            """
            try:
                cur.execute(insert_sql, (
                    data.name,
                    data.mesh_codes,
                    None,
                    data.gmlfile_path,
                    data.additional_info,
                    create_date,
                ))
                # 登録したレコードのIDを取得
                id_of_new_row = cur.fetchone()[0]
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Insert failed. {e}")

    return {
        "id": id_of_new_row
    }

@_app.put("/region_preset/{id}", include_in_schema=True, tags=['region_preset'])
async def put_region_preset(id: int, data:RegionPresetUpdateRequestBody) -> RegionPresetUpdateResponse:
    """
    指定した地域プリセットを更新する
    """
    # TODO: geomを取得
    # 関連付けるメッシュ毎建物citygmlについて、
    # 先頭部分に存在するgml:boundedBy/gml:Envelope/gml:lowerCornerの値を取得
    # MULTIPOLYGONのWKTでまとめる

    with get_conn() as conn:
        with conn.cursor() as cur:
            update_sql = """
            UPDATE region_presets
            SET
            name = %s,
            mesh_codes = %s,
            geom = NULL,
            gmlfile_path = %s,
            additional_info = %s
            WHERE id = %s
            ;
            """
            try:
                cur.execute(update_sql, (
                    data.name,
                    data.mesh_codes,
                    data.gmlfile_path,
                    data.additional_info,
                    id,))
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=404, detail=f"Not Exists ID. Get failed. {e}")

    return {
        "id": id
    }


@_app.delete("/region_preset/{id}", include_in_schema=True, tags=['region_preset'], status_code=204)
async def delete_region_preset(id: int):
    """
    指定したIDを持つ地域プリセットを削除する
    """
    print(type(id))
    with get_conn() as conn:
        with conn.cursor() as cur:
            delete_sql = sql.SQL("DELETE FROM region_presets WHERE id = %s")
            try:
                cur.execute(delete_sql, (id,))
                conn.commit()
            except Exception as e:
                print(delete_sql.as_string(conn), id)
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Not Exists ID. Delete failed. {e}")

    return None


# /earthquake_presets
@_app.get("/earthquake_presets", include_in_schema=True, tags=['earthquake_preset'])
async def get_earthquake_presets(page_num: int = 1, page_size: int = 10) -> EarthQuakePresets:
    """
    登録済み地震動プリセット一覧を取得する
    """
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            *
            FROM earthquake_presets
            ORDER BY create_date DESC
            LIMIT %s OFFSET %s
            """
            cur.execute(sql, (page_size, (page_num - 1) * page_size))
            row = cur.fetchall()
            print(row)
    if row == None:
        raise HTTPException(status_code=401, detail="No record.")

    earthquake_presets:list[EarthQuakePreset] = []
    for item in row:
        earthquake_presets.append(EarthQuakePreset(
            id=item[0],
            name=item[1],
            file_path_type1=item[2],
            file_path_type2=item[3],
            file_path_type3=item[4],
            additional_info=item[3],
            create_date=item[6].strftime('%Y/%m/%d %H:%M:%S')
        ))

    return EarthQuakePresets(
        total=0,
        page=page_num,
        page_size=page_size,
        earthquake_presets=earthquake_presets

    )

@_app.get("/earthquake_preset/{id}", include_in_schema=True, tags=['earthquake_preset'])
async def get_earthquake_preset(id: int) -> EarthQuakePreset:
    """
    指定した地震動プリセットを取得する
    """
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            *
            FROM earthquake_presets
            WHERE id = %s
            """
            try:
                cur.execute(sql, (id,))
                row = cur.fetchone()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")
    if row == None:
        raise HTTPException(status_code=400, detail="No record.")

    item = row
    earthquake_preset = EarthQuakePreset(
        id=item[0],
        name=item[1],
        file_path_type1=item[2],
        file_path_type2=item[3],
        file_path_type3=item[4],
        additional_info=item[5],
        create_date=item[6].strftime('%Y/%m/%d %H:%M:%S')
    )
    return earthquake_preset

@_app.post("/earthquake_preset", include_in_schema=True, tags=['earthquake_preset'], status_code=201)
async def post_earthquake_preset(
    name:str=Form(...), 
    additional_info:Optional[str]=Form(''),
    file1:Optional[UploadFile]=File(None),
    file2:Optional[UploadFile]=File(None),
    file3:Optional[UploadFile]=File(None),
    ) -> EarthQuakePresetCreateResponse:
    """
    地震動プリセットを登録する
    """
    # 登録したレコードのIDを取得するための変数
    id_of_new_row = None

    # 現在時刻を取得
    dt = datetime.datetime.now()
    create_date = dt.strftime('%Y-%m-%d %H:%M:%S')

    # ファイル名を取得する
    file_path_type1 = file1.filename if file1 is not None else None
    file_path_type2 = file2.filename if file2 is not None else None
    file_path_type3 = file3.filename if file3 is not None else None

    # DBに接続・INSERT文を実行・コミット
    with get_conn() as conn:
        with conn.cursor() as cur:
            insert_sql = """
            INSERT INTO earthquake_presets
            (name, file_path_type1, file_path_type2, file_path_type3, additional_info, create_date)
            VALUES
            (%s, %s, %s, %s, %s, %s)
            RETURNING id;
            """
            try:
                cur.execute(insert_sql, (
                    name,
                    file_path_type1,
                    file_path_type2,
                    file_path_type3,
                    additional_info,
                    create_date,))
                # 登録したレコードのIDを取得
                id_of_new_row = cur.fetchone()[0]
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Insert failed. {e}")

    ## S3にファイルアップロード
    settings = get_settings()
    earthquake_preset_s3_bucket = settings.earthquake_preset_s3_bucket

    # 実際にアップロードするファイル名は扱いやすいものに変換する
    s3_filename1 = "earthquake_presets_type1.csv" if file1 is not None else None
    s3_filename2 = "earthquake_presets_type2.csv" if file2 is not None else None
    s3_filename3 = "earthquake_presets_type3.csv" if file3 is not None else None

    # S3のKeyに成形する
    key1 = "{}/{}".format(id_of_new_row, s3_filename1) if file1 is not None else None
    key2 = "{}/{}".format(id_of_new_row, s3_filename2) if file2 is not None else None
    key3 = "{}/{}".format(id_of_new_row, s3_filename3) if file3 is not None else None

    s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))

    # ファイル1
    if file1 is not None:
        response = s3_client.put_object(
            Body = file1.file,
            Bucket = earthquake_preset_s3_bucket,
            Key = key1
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise HTTPException(status_code=500, detail="ファイルアップロードでエラーが発生しました")
        
    # ファイル2
    if file2 is not None:
        response = s3_client.put_object(
            Body = file2.file,
            Bucket = earthquake_preset_s3_bucket,
            Key = key2
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise HTTPException(status_code=500, detail="ファイルアップロードでエラーが発生しました")
        
    # ファイル3
    if file3 is not None:
        response = s3_client.put_object(
            Body = file3.file,
            Bucket = earthquake_preset_s3_bucket,
            Key = key3
        )
        if response['ResponseMetadata']['HTTPStatusCode'] != 200:
            raise HTTPException(status_code=500, detail="ファイルアップロードでエラーが発生しました")

    return {
        "id": id_of_new_row
    }

@_app.put("/earthquake_preset/{id}", include_in_schema=True, tags=['earthquake_preset'])
async def put_earthquake_preset(id: int, data:EarthQuakePresetUpdateRequestBody)->EarthQuakePresetUpdateResponse:
    """
    指定した地震動プリセットを更新する
    """

    with get_conn() as conn:
        with conn.cursor() as cur:
            update_sql = """
            UPDATE earthquake_presets
            SET
            name = %s,
            file_path_type1 = %s,
            file_path_type2 = %s,
            file_path_type3 = %s,
            additional_info = %s
            WHERE id = %s
            ;
            """
            try:
                cur.execute(update_sql, (
                    data.name,
                    data.file_path_type1,
                    data.file_path_type2,
                    data.file_path_type3,
                    data.additional_info,
                    id,
                ))
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=404, detail=f"Not Exists ID. Update failed. {e}")

    return {
        "id": id
    }


@_app.delete("/earthquake_preset/{id}", include_in_schema=True, tags=['earthquake_preset'], status_code=204)
async def delete_earthquake_preset(id: int):
    """
    指定した地震動プリセットを削除する
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            delete_sql = sql.SQL("DELETE FROM earthquake_presets WHERE id = %s")
            try:
                cur.execute(delete_sql, (id,))
                conn.commit()
            except Exception as e:
                print(delete_sql.as_string(conn), id)
                conn.rollback()
                raise HTTPException(status_code=404, detail=f"Not Exists ID. Delete failed. {e}")

    return {
        "id": id
    }

# /simulation_reserves
@_app.get("/simulation_reserves", include_in_schema=True, tags=['simulation_reserve'])
async def get_simulation_reserves(page_num: int = 1, page_size: int = 10, user_id: int = 0):
    """
    ユーザ毎の登録済みシミュレーション予約一覧を取得する
    """
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            sr.id,
            sr.session_id,
            sr.user_id,
            sr.calc_status_id,
            sr.region_presets_id,
            sr.earthquake_presets_id,
            sr.scp_server_path,
            sr.s3_calc_result_file_path,
            sr.s3_visualize_file_path,
            sr.visualize_url,
            sr.is_opened,
            sr.calc_reserve_datetime,
            sr.calc_complete_datetime,
            sr.visualize_complete_datetime,
            sr.create_date,
            sr.update_date,
            cs.status_name AS calc_status_name,
            rp.name as region_presets_name,
            rp.additional_info as region_presets_additional_info,
            ep.name as earthquake_presets_name,
            ep.additional_info as earthquake_presets_additional_info
            FROM simulation_reserves AS sr
            INNER JOIN calc_statuses AS cs ON sr.calc_status_id = cs.id
            INNER JOIN earthquake_presets ep ON sr.earthquake_presets_id = ep.id
            INNER JOIN region_presets rp ON sr.region_presets_id = rp.id
            WHERE sr.user_id = %s
            ORDER BY sr.update_date DESC
            LIMIT %s OFFSET %s
            """
            cur.execute(sql, (user_id, page_size, (page_num - 1) * page_size))
            row = cur.fetchall()
            print(row)
    if row == None:
        raise HTTPException(status_code=401, detail="No record.")

    simulation_reserves = []
    for item in row:
        simulation_reserves.append({
            "id": item[0],
            "session_id": item[1],
            "user_id": item[2],
            "region_presets_name": item[17],
            "earthquake_presets_name": item[19],
            "calc_status_id": item[3],
            "calc_status_name": item[16],
            "calc_reserve_datetime": item[11],
            "calc_complete_datetime": item[12],
            "visualize_complete_datetime": item[13],
            "create_date": item[14].strftime('%Y/%m/%d %H:%M:%S'),
            "update_date": item[15].strftime('%Y/%m/%d %H:%M:%S'),
        })

    return {
        "Total": 0,
        "Page": page_num,
        "PageSize": page_size,
        "simulation_reserves": simulation_reserves
    }

@_app.get("/simulation_reserve/{id}", include_in_schema=True, tags=['simulation_reserve'])
async def get_simulation_reserve(id: int, user_id: int = 0):
    """
    指定したシミュレーション予約を取得する
    """

    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            sr.id,
            sr.session_id,
            sr.user_id,
            sr.calc_status_id,
            sr.region_presets_id,
            sr.earthquake_presets_id,
            sr.scp_server_path,
            sr.s3_calc_result_file_path,
            sr.s3_visualize_file_path,
            sr.visualize_url,
            sr.is_opened,
            sr.calc_reserve_datetime,
            sr.calc_complete_datetime,
            sr.visualize_complete_datetime,
            sr.create_date,
            sr.update_date,
            cs.status_name AS calc_status_name,
            rp.name as region_presets_name,
            rp.additional_info as region_presets_additional_info,
            ep.name as earthquake_presets_name,
            ep.additional_info as earthquake_presets_additional_info
            FROM simulation_reserves AS sr
            JOIN calc_statuses AS cs ON sr.calc_status_id = cs.id
            INNER JOIN earthquake_presets ep ON sr.earthquake_presets_id = ep.id
            INNER JOIN region_presets rp ON sr.region_presets_id = rp.id
            WHERE sr.user_id = %s
            AND sr.id = %s
            """
            try:
                cur.execute(sql, (user_id, id,))
                row = cur.fetchone()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")
    if row == None:
        raise HTTPException(status_code=400, detail="No record.")

    item = row
    simulation_reserve = {
        "id": item[0],
        "session_id": item[1],
        "user_id": item[2],
        "calc_status_id": item[3],
        "calc_status_name": item[16],
        "region_presets_id": item[4],
        "region_presets_name": item[17],
        "region_presets_additional_info": item[18],
        "earthquake_presets_id": item[5],
        "earthquake_presets_name": item[19],
        "earthquake_presets_additional_info": item[20],
        "scp_server_path": item[6],
        "s3_calc_result_file_path": item[7],
        "s3_visualize_file_path": item[8],
        "visualize_url": item[9],
        "is_opened": item[10],
        "calc_reserve_datetime": item[11],
        "calc_complete_datetime": item[12],
        "visualize_complete_datetime": item[13],
        "create_date": item[14].strftime('%Y/%m/%d %H:%M:%S'),
        "update_date": item[15].strftime('%Y/%m/%d %H:%M:%S'),
    }
    return simulation_reserve


@_app.get("/simulation_reserve/{id}/attribute", include_in_schema=True, tags=['simulation_reserve'])
async def get_simulation_reserve_attribute(id: int, user_id: int = 0):
    """
    指定したシミュレーション予約の属性を取得する
    """
    simulation_reserve = await get_simulation_reserve(id, user_id)

    return {
        "id": simulation_reserve["id"],
        "session_id": simulation_reserve["session_id"],
        "user_id": simulation_reserve["user_id"],
        "calc_status_id": simulation_reserve["calc_status_id"],
        "region_presets_id": simulation_reserve["region_presets_id"],
        "earthquake_presets_id": simulation_reserve["earthquake_presets_id"],
        "scp_server_path": simulation_reserve["scp_server_path"],
        "s3_calc_result_file_path": simulation_reserve["s3_calc_result_file_path"],
        "s3_visualize_file_path": simulation_reserve["s3_visualize_file_path"],
        "visualize_url": simulation_reserve["visualize_url"],
        "is_opened": simulation_reserve["is_opened"],
    }

@_app.get("/simulation_reserve/{id}/downloads", include_in_schema=True, tags=['simulation_reserve'])
async def get_simulation_reserve_downloads(id: int, user_id: int = 0):
    """
    指定したシミュレーション予約のダウンロード可能なファイルのURL一覧を取得する
    """
    simulation_reserve = await get_simulation_reserve(id, user_id)

    return {
        "id": simulation_reserve["id"],
        "session_id": simulation_reserve["session_id"],
        "user_id": simulation_reserve["user_id"],
        "s3_calc_result_file_path": simulation_reserve["s3_calc_result_file_path"],
    }

#     s3 = boto3.client('s3')
#     s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))
#      s3.generate_presigned_url(
#   ClientMethod = 'get_object',
#   Params = {'Bucket' : BUCKET, 'Key' : KEY},
#   ExpiresIn = 3600,
#   HttpMethod = 'GET')

@_app.get("/simulation_reserve/{id}/visualize_url", include_in_schema=True, tags=['simulation_reserve'])
async def get_simulation_reserve_visualize_url(id: int, user_id: int = 0):
    """
    指定したシミュレーション予約の可視化可能なURLを取得する
    """
    simulation_reserve = await get_simulation_reserve(id, user_id)

    return {
        "id": simulation_reserve["id"],
        "session_id": simulation_reserve["session_id"],
        "user_id": simulation_reserve["user_id"],
        "visualize_url": simulation_reserve["visualize_url"],
        "is_opened": simulation_reserve["is_opened"],
    }

@_app.post("/simulation_reserve", include_in_schema=True, tags=['simulation_reserve'], status_code=201)
async def post_simulation_reserve(data:SimulationReserveCreateRequestBody)->EarthQuakePresetCreateResponse:
    """
    シミュレーション予約を登録する
    """
    # 登録したレコードのIDを取得するための変数
    id_of_new_row = None

    # 現在時刻を取得
    dt = datetime.datetime.now()
    create_date = dt.strftime('%Y-%m-%d %H:%M:%S')
    calc_reserve_datetime = create_date

    # TODO: session_id を Cognito から取得
    session_id = "session_id"
    calc_status = CALC_STATUS_CALCULATING

    # DBに接続・INSERT文を実行・コミット
    with get_conn() as conn:
        with conn.cursor() as cur:
            insert_sql = """
            INSERT INTO simulation_reserves
            (
                session_id, 
                user_id, 
                calc_status_id,
                region_presets_id, 
                earthquake_presets_id, 
                scp_server_path,
                s3_calc_result_file_path, 
                s3_visualize_file_path, 
                visualize_url,
                is_opened, 
                calc_reserve_datetime, 
                calc_complete_datetime,
                visualize_complete_datetime, 
                create_date, 
                update_date
            ) VALUES (
                %s, 
                %s, 
                %s,
                %s, 
                %s, 
                %s,
                %s, 
                %s, 
                %s,
                %s, 
                %s, 
                %s,
                %s, 
                %s, 
                %s
            ) RETURNING id
            ;
            """
            try:
                insert_params = (
                    session_id, 
                    data.user_id, 
                    calc_status,
                    data.region_preset_id, 
                    data.earthquake_preset_id, 
                    None,
                    None, 
                    None, 
                    None,
                    False, 
                    calc_reserve_datetime, 
                    None,
                    None, 
                    create_date, 
                    create_date,
                )
                cur.execute(insert_sql, insert_params)

                # 登録したレコードのIDを取得
                id_of_new_row = cur.fetchone()[0]
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Insert failed 1. {e}")

            print('id_of_new_row:', id_of_new_row)
            # 取得したIDを用いた更新処理
            update_sql = """
            UPDATE simulation_reserves
            SET
            scp_server_path = %s,
            s3_calc_result_file_path = %s,
            s3_visualize_file_path = %s,
            update_date = %s
            WHERE id = %s
            ;
            """
            try:
                update_params = (
                    f"/home/ubuntu/scp/{id_of_new_row}",
                    f"s3://bridge-eq-sim-calc-result/{id_of_new_row}",
                    f"s3://bridge-eq-sim-visualize/{id_of_new_row}",
                    create_date,
                    id_of_new_row,
                )
                cur.execute(update_sql, update_params)

                # 登録したレコードのIDを取得
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Insert failed 2. {e}")
            
            # ファイル共有のS3バケットにシミュレーション予約IDのディレクトリを追加する
            settings = get_settings()
            simulation_reserve_s3_bucket = settings.simulation_reserve_s3_bucket
            s3_client = boto3.client('s3', config=Config(signature_version='s3v4'))

            response = s3_client.put_object(
                Bucket = simulation_reserve_s3_bucket,
                Key = f"{id_of_new_row}/"
            )
            if response['ResponseMetadata']['HTTPStatusCode'] != 200:
                raise HTTPException(status_code=500, detail="シミュレーション予約のS3フォルダ作成処理でエラーが発生しました")

            # 予約時に指定された、地震動プリセットファイル、地域プリセットで指定されたCityGMLファイルをコピー
            citygml_preset_s3_bucket = settings.citygml_preset_s3_bucket
            copy_all_keys_v2(
              citygml_preset_s3_bucket,
              f"{data.region_preset_id}/",
              simulation_reserve_s3_bucket,
              f"{id_of_new_row}/citygml/"
            )
            earthquake_preset_s3_bucket = settings.earthquake_preset_s3_bucket
            copy_all_keys_v2(
              earthquake_preset_s3_bucket,
              f"{data.earthquake_preset_id}/",
              simulation_reserve_s3_bucket,
              f"{id_of_new_row}/earthquake/"
            )

    return {
        "id": id_of_new_row,
        "user_id": data.user_id,
    }


@_app.put("/simulation_reserve", include_in_schema=True, tags=['simulation_reserve'])
async def put_simulation_reserve(id: int, user_id: int, calc_status_id: int, visualize_url: str = None, is_opened: bool = False):
    """
    シミュレーション予約を更新する
    """

    # 現在時刻を取得
    dt = datetime.datetime.now()
    update_date = dt.strftime('%Y-%m-%d %H:%M:%S')

    update_params = {
        "calc_status_id": calc_status_id,
        "update_date": update_date,
        "is_opened": is_opened,
    }

    # calc_status_id によって、更新する項目/値を追加
    # calc_status_id が CALC_STATUS_CALCULATE_COMPLETE, CALC_STATUS_CALCULATE_ERROR の場合、
    # calc_complete_datetimeを更新
    if calc_status_id == CALC_STATUS_CALCULATE_COMPLETE or calc_status_id == CALC_STATUS_CALCULATE_ERROR:
        calc_complete_datetime = update_date
        update_params["calc_complete_datetime"] = calc_complete_datetime

    # calc_status_id が CALC_STATUS_VISUALIZE_COMPLETE, CALC_STATUS_VISUALIZE_ERROR の場合、
    # visualize_url が指定されていれば、visualize_url, visualize_complete_datetime を更新
    if calc_status_id == CALC_STATUS_VISUALIZE_COMPLETE or calc_status_id == CALC_STATUS_VISUALIZE_ERROR:
        if visualize_url != None:
            update_params["visualize_url"] = visualize_url
            visualize_complete_datetime = update_date
            update_params["visualize_complete_datetime"] = visualize_complete_datetime

    # UPDATE文のSET句を作成
    update_fields_value = [
        sql.Composed([sql.Identifier(k), sql.SQL(" = "), sql.Placeholder(k)]) for k in update_params.keys()
        ]

    # DBに接続・INSERT文を実行・コミット
    with get_conn() as conn:
        with conn.cursor() as cur:
            update_sql = """
            UPDATE simulation_reserves
            SET
            {update_columns}
            WHERE id = {id}
            AND user_id = {user_id}
            ;
            """
            update_sql = sql.SQL(update_sql).format(
                update_columns=sql.SQL(', ').join(
                   update_fields_value
                ),
                id=sql.Literal(id),
                user_id=sql.Literal(user_id)
            )
            print(update_sql.as_string(conn))

            try:
                cur.execute(update_sql, update_params)
                conn.commit()
            except Exception as e:
                conn.rollback()
                raise HTTPException(status_code=400, detail=f"Update failed. {e}")

    return {
        "id": id,
        "user_id": user_id,
    }

@_app.get("/registered_citygmls", include_in_schema=True, tags=['registered_citygmls'])
async def get_registered_citygmls(upper_lon: float, upper_lat: float, lower_lon: float, lower_lat: float):

    # 検索用ポリゴン文字列の作成
    b, l = upper_lat, upper_lon
    t, r = lower_lat, lower_lon
    cond_bbox = f"POLYGON(({l} {b}, {l} {t}, {r} {t}, {r} {b}, {l} {b}))"

    # 検索クエリ組み立て
    rows = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = f"""
            SELECT
            ST_AsGeoJSON(rc.*)
            FROM registered_citygmls AS rc
            WHERE ST_Intersects(ST_GeometryFromText('{cond_bbox}', 4326), rc.bbox)
            """

            try:
                cur.execute(sql)
                rows = cur.fetchall()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")

    # 検索結果が0件の場合はエラーにする。
    if rows == None:
        raise HTTPException(status_code=400, detail="No record.")

    registered_citygmls = []
    for item in rows:
        registered_citygmls.append(json.loads(item[0]))

    return {
        "type": "FeatureCollection",
        "features": registered_citygmls
    }

@_app.get("/registered_citygmls/meshcodes", include_in_schema=True, tags=['registered_citygmls'])
async def get_registered_citygmls(meshcode_list: str):

    # カンマ区切りで渡されたメッシュコードをリストに変換
    meshcodes = list(map(str, meshcode_list.split(',')))
    print(meshcodes)
    meshcodes_str = "', '".join(meshcodes)
    meshcodes_str = f"'{meshcodes_str}'"
    print(meshcodes_str)

    # 検索クエリ組み立て
    rows = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = f"""
            SELECT
            ST_AsGeoJSON(rc.*)
            FROM registered_citygmls AS rc
            WHERE rc.mesh_code IN ({meshcodes_str})
            """

            try:
                cur.execute(sql)
                rows = cur.fetchall()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")
    if rows == None:
        raise HTTPException(status_code=400, detail="No record.")

    registered_citygmls = []
    for item in rows:
        registered_citygmls.append(json.loads(item[0]))

    return {
        "type": "FeatureCollection",
        "features": registered_citygmls
    }
    
@_app.get("/simulation_visualize/{id}", include_in_schema=True, tags=['simulation_visualize'])
async def get_simulation_visualize(id: int, user_id: int = 0, jwt_token:str = Header()):
    """
    Cognitoログイン済みか否かチェックし、ログイン済みの場合は指定した可視化情報を取得する
    """

    ## ログイン状態か否かのチェック
    result = verify_jwt(jwt_token)

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    payload = result["payload"]
    if "email" not in payload:
        raise HTTPException(status_code=401, detail="Email not found in payload")

    ## ログイン状態の場合は可視化情報を返す
    row = None
    with get_conn() as conn:
        with conn.cursor() as cur:
            sql = """
            SELECT
            sr.id,
            sr.visualize_url,
            FROM simulation_reserves AS sr
            WHERE sr.user_id = %s
            AND sr.id = %s
            """
            try:
                cur.execute(sql, (user_id, id,))
                row = cur.fetchone()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Select failed. {e}")
    if row == None:
        raise HTTPException(status_code=400, detail="No record.")

    item = row
    simulation_reserve = {
        "id": item[0],
        "visualize_url": item[1],
    }
    return simulation_reserve


# app定義
app = CORSMiddleware(
    app=_app,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mangum handler
handler = Mangum(_app, lifespan="off")
