from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from app.database import Admin, Patient, Doctor

router = APIRouter(prefix="/admin", tags=["admin"])


class AdminCreatedResponse(BaseModel):
    msg: str


@router.get("/me/{id}")
async def read_profile_data(id):
    admin_data = await Admin.get_or_none(id=id).values()
    if not admin_data:
        raise HTTPException(status_code=404,detail="Admin not found")
    return admin_data



# /admin/patient 

@router.get("/patient/{id}")
async def read_patient_data(id):
    patient_data = await Patient.get_or_none(id=id).values()
    if not patient_data:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_data

@router.delete("/patient/{id}")
async def delete_patient(id):
    patient = await Patient.get_or_none(id=id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    await patient.delete()
    
    return {"msg": "Patient deleted successfully", "patient_id": id}


# /admin/doctor 
@router.get("/doctor/{id}")
async def read_doctor_data(id):
    doctor_data = await Doctor.get_or_none(id=id).values()
    if not doctor_data:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor_data


@router.delete("/doctor/{id}")
async def delete_doctor(id):
    doctor = await Doctor.get_or_none(id=id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    await doctor.delete()
    
    return {"msg": "doctor deleted successfully", "doctor_id": id}