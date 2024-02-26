import { 
  RegionPresetGetResponse,
  RegionPresetsGetResponse,
  RegionPresetPathParam,
  RegionPresetPostRequestBody,
  RegionPresetPostResponse,
  RegionPresetPutRequestBody,
  RegionPresetPutResponse,
  RegionPresetDeleteResponse
} from "../../models/RegionPresets";

export interface IRegionPresetsApi {
  list(): Promise<RegionPresetsGetResponse>;
  get(id: RegionPresetPathParam): Promise<RegionPresetGetResponse>;
  create(data: RegionPresetPostRequestBody): Promise<RegionPresetPostResponse>;
  update(id: RegionPresetPathParam, data: RegionPresetPutRequestBody): Promise<RegionPresetPutResponse>;
  delete(id: RegionPresetPathParam): Promise<RegionPresetDeleteResponse>;
}