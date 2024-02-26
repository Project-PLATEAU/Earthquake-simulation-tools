import axios from "axios";
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
import { IRegionPresetsApi } from "../interface/RegionPresets";

export class RegionPresetApi implements IRegionPresetsApi {

  async list(): Promise<RegionPresetsGetResponse> {
    const response = await axios.get<RegionPresetsGetResponse>(`/region_presets/`);
    return response.data;
  }

  async get(param: RegionPresetPathParam): Promise<RegionPresetGetResponse> {
    const response = await axios.get<RegionPresetGetResponse>(`/region_preset/${param.id}`);
    return response.data;
  }

  async create(data: RegionPresetPostRequestBody): Promise<RegionPresetPostResponse> {
    try {
      const response = await axios.post<RegionPresetPostResponse>(`/region_preset`, data, {
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    } catch (e) {
      // if (e instanceof NotFoundError) return null;
      throw e;
    }
  }

  async update(param: RegionPresetPathParam, data: RegionPresetPutRequestBody): Promise<RegionPresetPutResponse> {
    try {
      const response = await axios.put<RegionPresetPostResponse>(`/region_preset/${param.id}`, data, {
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    } catch (e) {
      // if (e instanceof NotFoundError) return null;
      throw e;
    }
  }

  async delete(param: RegionPresetPathParam): Promise<RegionPresetDeleteResponse> {
    try {
      const response = await axios.delete<RegionPresetDeleteResponse>(`/region_preset/${param.id}`);
      return response.data;
    } catch (e) {
      // if (e instanceof NotFoundError) return null;
      throw e;
    }
  }
}
