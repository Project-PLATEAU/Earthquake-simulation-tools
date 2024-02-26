from pydantic import BaseModel
from typing import Optional

class SimulationReserve(BaseModel):
    id: int;
    region_presets_id: int;
    region_presets_name: str;
    region_presets_additional_info: Optional[str];
    earthquake_presets_id: int;
    earthquake_presets_name: str;
    earthquake_additional_info: Optional[str];
    calc_status_id: int;
    calc_status_name: str;
    create_date: str;

class SimulationReserves(BaseModel):
    Total: int
    Page: int
    PageSize: int
    simulation_reserves: list[SimulationReserve]


class SimulationReserveCreateRequestBody(BaseModel):
    user_id: int;
    region_preset_id: int;
    earthquake_preset_id: int;


class SimulationReserveUpdateRequestBody(SimulationReserveCreateRequestBody):
    id: int;
    user_id: int;
    calc_status_id: int;
    visualize_url: str;
    is_opened: bool;


class SimulationReserveCreateResponse(BaseModel):
    id: int
    user_id: int


class SimulationReserveUpdateResponse(BaseModel):
    id: int
    user_id: int

