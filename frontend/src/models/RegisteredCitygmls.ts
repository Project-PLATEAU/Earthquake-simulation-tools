import { type MapGeoJSONFeature } from "maplibre-gl";
class RegisteredCitygmlsGetResponse {
  value: string | undefined;
  features: Array<MapGeoJSONFeature> | undefined;
}

class RegisteredCitygmlsGetRequestBody {
  upper_lon: number | undefined;
  upper_lat: number | undefined;
  lower_lon: number | undefined;
  lower_lat: number | undefined;
}

class RegisteredCitygmlsFromMeshcodeGetRequestBody {
  meshcode_list: Array<string> | undefined;
}

export {
  RegisteredCitygmlsGetResponse,
  RegisteredCitygmlsGetRequestBody,
  RegisteredCitygmlsFromMeshcodeGetRequestBody,
};
