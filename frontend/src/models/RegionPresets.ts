/** 地域プリセット情報 */
class RegionPresetGetResponse {
  id: number;
  name: string;
  geom: string;
  gmlfile_path: string;
  mesh_codes: string;
  additional_info: string;
  create_date: string;
}

/** 地域プリセットリスト */
class RegionPresetsGetResponse {
  Total: number | undefined;
  Page: number | undefined;
  PageSize: number | undefined;
  region_presets: RegionPresetGetResponse[] | undefined;
}

/** 地域プリセットパスパラメータ */
class RegionPresetPathParam {
  id: string | undefined;
}

// 地域プリセット登録: リクエストBody
class RegionPresetPostRequestBody {
  name: string;
  gmlfile_path: string;
  mesh_codes: string;
  additional_info: string;
}

// 地域プリセット登録: レスポンス
class RegionPresetPostResponse {
  id: number | undefined;
}
/** 地域プリセット更新: リクエストボディ */
class RegionPresetPutRequestBody {
  id: number;
  name: string;
  gmlfile_path: string;
  mesh_codes: string;
  additional_info: string;
}

/** 地域プリセット更新: レスポンス */
class RegionPresetPutResponse {
  id: number | undefined;
}

/** 地域プリセット削除: レスポンス */
class RegionPresetDeleteResponse {
  id: number | undefined;
}

export {
  RegionPresetGetResponse,
  RegionPresetsGetResponse,
  RegionPresetPathParam,
  RegionPresetPostRequestBody,
  RegionPresetPostResponse,
  RegionPresetPutRequestBody,
  RegionPresetPutResponse,
  RegionPresetDeleteResponse
};