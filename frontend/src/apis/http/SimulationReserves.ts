import axios from "axios";
import { 
  SimulationReserveGetResponse,
  SimulationReservesGetResponse,
  SimulationReservesQueryParam,
  SimulationReservePathParam,
  SimulationReservePostRequestBody,
  SimulationReservePostResponse,
  SimulationReservePutRequestBody,
  SimulationReservePutResponse,
} from "../../models/SimulationReserves";
import { ISimulationReservesApi } from "../interface/SimulationReserves";

export class SimulationReserveApi implements ISimulationReservesApi {

  async list(params: SimulationReservesQueryParam): Promise<SimulationReservesGetResponse> {
    const response = await axios.get<SimulationReservesGetResponse>(`/simulation_reserves/`, { params });
    return response.data;
  }

  async get(path: SimulationReservePathParam, params: SimulationReservesQueryParam): Promise<SimulationReserveGetResponse> {
    const response = await axios.get<SimulationReserveGetResponse>(`/simulation_reserve/${path.id}`, { params });
    return response.data;
  }

  async create(data: SimulationReservePostRequestBody): Promise<SimulationReservePostResponse> {
    try {
      const response = await axios.post<SimulationReservePostResponse>(`/simulation_reserve`, data, {
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

  async update(param: SimulationReservePathParam, data: SimulationReservePutRequestBody): Promise<SimulationReservePutResponse> {
    try {
      const response = await axios.put<SimulationReservePostResponse>(`/simulation_reserve/${param.id}`, data, {
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
}
