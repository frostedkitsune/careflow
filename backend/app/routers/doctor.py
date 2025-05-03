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
    # fetch the doctor
    doctor = await Doctor.get_or_none(id=1).values()
    if not doctor:
        raise HTTPException(status_code=404,detail="Doctor not found")
    return doctor
