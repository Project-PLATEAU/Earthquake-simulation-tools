from pydantic import BaseModel
from typing import Optional

class RegionPreset(BaseModel):
    id: int
    name: str
    geom: Optional[str]
    gmlfile_path: Optional[str]
    mesh_codes: Optional[str]
    additional_info: Optional[str]
    create_date: str


class RegionPresets(BaseModel):
    total: int
    page: int
    page_size: int
    region_presets: list[RegionPreset]


class RegionPresetCreateRequestBody(BaseModel):
    name: str
    gmlfile_path: str
    mesh_codes: str
    additional_info: str


class RegionPresetUpdateRequestBody(RegionPresetCreateRequestBody):
    id: int


class RegionPresetCreateResponse(BaseModel):
    id: int


class RegionPresetUpdateResponse(BaseModel):
    id: int

