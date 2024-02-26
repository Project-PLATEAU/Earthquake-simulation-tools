import { 
    RegisteredCitygmlsGetResponse,
    RegisteredCitygmlsGetRequestBody
} from "../../models/RegisteredCitygmls";

export interface IRegisteredCitygmlsApi {
  get(params: RegisteredCitygmlsGetRequestBody): Promise<RegisteredCitygmlsGetResponse>;
}