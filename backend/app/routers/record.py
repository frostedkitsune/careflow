from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.database import Records, Records_Pydantic

router = APIRouter(prefix="/records", tags=["records"])

class RecordsCreatedResponse(BaseModel):
    msg: str

@router.get("/me", response_model=RecordsCreatedResponse)
async def read_profile_data() -> RecordsCreatedResponse:
    # data = await Records.create(username="demouser", name="Demo User", password_hash="securepasshash")
    # print(data)
    # return await Records_Pydantic.from_tortoise_orm(data)
    return JSONResponse({ "msg": "records created" }, status.HTTP_200_OK) 
