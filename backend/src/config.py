from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    postgis_host: str
    postgis_port: int = 5432
    postgis_dbname: str = "postgres"
    postgis_user: str = "postgres"
    postgis_password: str
    citygml_preset_s3_bucket: str
    earthquake_preset_s3_bucket: str
    simulation_reserve_s3_bucket: str
    signed_url_expires_in: int = 3600
    cognito_userpool_id: str
    cognito_userpool_webclient_id: str

    model_config = SettingsConfigDict(env_file=".env")
