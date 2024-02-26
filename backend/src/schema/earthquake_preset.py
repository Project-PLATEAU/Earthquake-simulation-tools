from pydantic import BaseModel
from typing import Optional

class EarthQuakePreset(BaseModel):
    id: int
    name: str
    file_path_type1: Optional[str]
    file_path_type2: Optional[str]
    file_path_type3: Optional[str]
    additional_info: Optional[str]
    create_date: str


class EarthQuakePresets(BaseModel):
    total: int
    page: int
    page_size: int
    earthquake_presets: list[EarthQuakePreset]


class EarthQuakePresetCreateRequestBody(BaseModel):
    name: str
    file_path_type1: str
    file_path_type2: str
    file_path_type3: str
    additional_info: str


class EarthQuakePresetUpdateRequestBody(EarthQuakePresetCreateRequestBody):
    id: int


class EarthQuakePresetCreateResponse(BaseModel):
    id: int


class EarthQuakePresetUpdateResponse(BaseModel):
    id: int
