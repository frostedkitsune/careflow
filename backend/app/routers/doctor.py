from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

# import the Model
from app.database import Doctor, Doctor_Pydantic

# router
router = APIRouter(prefix="/doctor", tags=["doctor"])

# todo: the doctor ID should be fetch from JWT

# route /me(GET)
@router.get(
    path = "/me",response_model=Doctor_Pydantic)
async def get_doctor_data():
    try:
        # fetch the doctor
        doctor = await Doctor.get_or_none(id=1).values()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")
        return doctor
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

# model for create doctor
class DoctorCreateData(BaseModel):
    name: str
    email: str
    phone: str
    specialization: str


# route /me(POST)
@router.post(path="/me")
async def add_doctor(doctor_data:DoctorCreateData):
    try:
        await Doctor.create(
            name=doctor_data.name,
            email=doctor_data.email,
            phone=doctor_data.phone,
            specialization=doctor_data.specialization,
        )
        return {"msg": "doctor created"}
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

