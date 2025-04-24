from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.database import Patient, Patient_Pydantic

router = APIRouter(prefix="/patient", tags=["patient"])

class PatientCreatedResponse(BaseModel):
    msg: str

@router.get("/me", response_model=PatientCreatedResponse)
async def read_profile_data() -> PatientCreatedResponse:
    # data = await Patient.create(username="demouser", name="Demo User", password_hash="securepasshash")
    # print(data)
    # return await Patient_Pydantic.from_tortoise_orm(data)
    return JSONResponse({ "msg": "patient created" }, status.HTTP_200_OK) 
