import axios from "axios";
import {
  RegisteredCitygmlsGetResponse,
  RegisteredCitygmlsGetRequestBody,
  RegisteredCitygmlsFromMeshcodeGetRequestBody,
} from "../../models/RegisteredCitygmls";
import { IRegisteredCitygmlsApi } from "../interface/RegisteredCitygmls";

export class RegisteredCitygmlsApi implements IRegisteredCitygmlsApi {
  async get(
    params: RegisteredCitygmlsGetRequestBody
  ): Promise<RegisteredCitygmlsGetResponse> {
    const response = await axios.get<RegisteredCitygmlsGetResponse>(
      `/registered_citygmls/`,
      {
        params: {
          upper_lon: params.upper_lon,
          upper_lat: params.upper_lat,
          lower_lon: params.lower_lon,
          lower_lat: params.lower_lat,
        },
      }
    );
    return response.data;
  }

  async getFromMeshCode(
    params: RegisteredCitygmlsFromMeshcodeGetRequestBody
  ): Promise<RegisteredCitygmlsGetResponse> {
    const response = await axios.get<RegisteredCitygmlsGetResponse>(
      `/registered_citygmls/meshcodes/`,
      {
        params: {
          meshcode_list: params.meshcode_list?.join(",") ?? "",
        },
      }
    );
    return response.data;
  }
}
