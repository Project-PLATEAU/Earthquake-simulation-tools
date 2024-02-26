import axios from "axios";
import { 
  EarthQuakePresetGetResponse,
  EarthQuakePresetsGetResponse,
  EarthQuakePresetPathParam,
  EarthQuakePresetPostResponse,
  EarthQuakePresetPutRequestBody,
  EarthQuakePresetPutResponse,
  EarthQuakePresetDeleteResponse
} from "../../models/EarthQuakePresets";
import { IEarthQuakePresetsApi } from "../interface/EarthQuakePresets";

export class EarthQuakePresetApi implements IEarthQuakePresetsApi {

  async list(): Promise<EarthQuakePresetsGetResponse> {
    const response = await axios.get<EarthQuakePresetsGetResponse>(`/earthquake_presets/`);
    return response.data;
  }

  async get(param: EarthQuakePresetPathParam): Promise<EarthQuakePresetGetResponse> {
    const response = await axios.get<EarthQuakePresetGetResponse>(`/earthquake_preset/${param.id}`);
    return response.data;
  }

  async create(form: FormData): Promise<EarthQuakePresetPostResponse> {
    try {
      const response = await axios.post<EarthQuakePresetPostResponse>(`/earthquake_preset`, form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (e) {
      // if (e instanceof NotFoundError) return null;
      throw e;
    }
  }

  async update(param: EarthQuakePresetPathParam, data: EarthQuakePresetPutRequestBody): Promise<EarthQuakePresetPutResponse> {
    try {
      const response = await axios.put<EarthQuakePresetPostResponse>(`/earthquake_preset/${param.id}`, data, {
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

  async delete(param: EarthQuakePresetPathParam): Promise<EarthQuakePresetDeleteResponse> {
    try {
      const response = await axios.delete<EarthQuakePresetDeleteResponse>(`/earthquake_preset/${param.id}`);
      return response.data;
    } catch (e) {
      // if (e instanceof NotFoundError) return null;
      throw e;
    }
  }
}