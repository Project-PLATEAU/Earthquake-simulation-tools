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

export interface ISimulationReservesApi {
  list(param: SimulationReservesQueryParam): Promise<SimulationReservesGetResponse>;
  get(id: SimulationReservePathParam, param:SimulationReservesQueryParam): Promise<SimulationReserveGetResponse>;
  create(data: SimulationReservePostRequestBody): Promise<SimulationReservePostResponse>;
  update(id: SimulationReservePathParam, data: SimulationReservePutRequestBody): Promise<SimulationReservePutResponse>;
}