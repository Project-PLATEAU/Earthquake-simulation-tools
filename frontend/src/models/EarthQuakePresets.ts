/** 地振動プリセット情報 */
class EarthQuakePresetGetResponse {
  id: number | undefined;;
  name: string | undefined;;
  file_path_type1: string | undefined;;
  file_path_type2: string | undefined;;
  file_path_type3: string | undefined;;
  additional_info: string | undefined;;
  create_date: string | undefined;;
}

/** 地振動プリセットリスト */
class EarthQuakePresetsGetResponse {
  Total: number | undefined;
  Page: number | undefined;
  PageSize: number | undefined;
  earthquake_presets: EarthQuakePresetGetResponse[] | undefined;
}

/** 地振動プリセットパスパラメータ */
class EarthQuakePresetPathParam {
  id: string | undefined;
}

// 地振動プリセット登録: リクエストBody
class EarthQuakePresetPostRequestBody {
  name: string | undefined;;
  file_path_type1: string | undefined;;
  file_path_type2: string | undefined;;
  file_path_type3: string | undefined;;
  additional_info: string | undefined;;
}

// 地振動プリセット登録: レスポンス
class EarthQuakePresetPostResponse {
  id: number | undefined;
}
/** 地振動プリセット更新: リクエストボディ */
class EarthQuakePresetPutRequestBody {
  id: number | undefined;;
  name: string | undefined;;
  file_path_type1: string | undefined;;
  file_path_type2: string | undefined;;
  file_path_type3: string | undefined;;
  additional_info: string | undefined;;
}

/** 地振動プリセット更新: レスポンス */
class EarthQuakePresetPutResponse {
  id: number | undefined;
}

/** 地振動プリセット削除: レスポンス */
class EarthQuakePresetDeleteResponse {
  id: number | undefined;
}

export {
  EarthQuakePresetGetResponse,
  EarthQuakePresetsGetResponse,
  EarthQuakePresetPathParam,
  EarthQuakePresetPostRequestBody,
  EarthQuakePresetPostResponse,
  EarthQuakePresetPutRequestBody,
  EarthQuakePresetPutResponse,
  EarthQuakePresetDeleteResponse,
};