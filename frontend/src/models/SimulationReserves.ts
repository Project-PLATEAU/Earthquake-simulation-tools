/** シミュレーション予約情報 */
class SimulationReserveGetResponse {
  id: number;
  region_presets_id: number;
  region_presets_name: string;
  region_presets_additional_info: string;
  earthquake_presets_id: number;
  earthquake_presets_name: string;
  earthquake_additional_info: string;
  calc_status_id: number;
  calc_status_name: string;
  create_date: string;
}

/** シミュレーション予約リスト */
class SimulationReservesGetResponse {
  Total: number;
  Page: number;
  PageSize: number;
  simulation_reserves: SimulationReserveGetResponse[]
}

/** シミュレーション予約パスパラメータ */
class SimulationReservesQueryParam {
  user_id: number;
}

/** シミュレーション予約パスパラメータ */
class SimulationReservePathParam {
  id: string;
}

// シミュレーション予約登録: リクエストBody
class SimulationReservePostRequestBody {
  user_id: number;
  region_preset_id: number;
  earthquake_preset_id: number;
}

// シミュレーション予約登録: レスポンス
class SimulationReservePostResponse {
  id: number;
  user_id: number;
}
/** シミュレーション予約更新: リクエストボディ */
class SimulationReservePutRequestBody {
  id: number;
  user_id: number;
  calc_status_id: number;
  visualize_url: string;
  is_opened: boolean;
}

/** シミュレーション予約更新: レスポンス */
class SimulationReservePutResponse {
  id: number;
  user_id: number;
}

export {
  SimulationReservesGetResponse,
  SimulationReserveGetResponse,
  SimulationReservePathParam,
  SimulationReservesQueryParam,
  SimulationReservePostRequestBody,
  SimulationReservePostResponse,
  SimulationReservePutRequestBody,
  SimulationReservePutResponse,
};