import { 
  EarthQuakePresetGetResponse,
  EarthQuakePresetsGetResponse,
  EarthQuakePresetPathParam,
  EarthQuakePresetPostResponse,
  EarthQuakePresetPutRequestBody,
  EarthQuakePresetPutResponse,
  EarthQuakePresetDeleteResponse,
} from "../../models/EarthQuakePresets";

export interface IEarthQuakePresetsApi {
  list(): Promise<EarthQuakePresetsGetResponse>;
  get(id: EarthQuakePresetPathParam): Promise<EarthQuakePresetGetResponse>;
  create(form: FormData): Promise<EarthQuakePresetPostResponse>;
  update(id: EarthQuakePresetPathParam, data: EarthQuakePresetPutRequestBody): Promise<EarthQuakePresetPutResponse>;
  delete(id: EarthQuakePresetPathParam): Promise<EarthQuakePresetDeleteResponse>;
}