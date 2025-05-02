from typing import Optional
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

from app.database import (
    Admin,
    Admin_Pydantic,
    Patient,
    Patient_Pydantic,
    Doctor,
    Doctor_Pydantic,
    Receptionist,
    Receptionist_Pydantic
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get(
    "/me/{id}", response_model=Admin_Pydantic, response_model_exclude={"password_hash"}
)
async def read_profile_data(id):
    admin_data = await Admin.get_or_none(id=id).values()  
    if not admin_data:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin_data


# /admin/patient


@router.get("/patient/{id}", response_model=Patient_Pydantic)
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


@router.get("/doctor/{id}", response_model=Doctor_Pydantic)
async def read_doctor_data(id):
    doctor_data = await Doctor.get_or_none(id=id).values()
    if not doctor_data:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor_data


class DoctorCreateData(BaseModel):
    name: str
    email: str
    phone: str
    specialization: str


@router.post("/doctor")
async def add_doctor(doctor_data: DoctorCreateData):
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


class DoctorUpdateData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None


@router.post("/update/doctor/{id}")
async def update_doctor(id, updated_data: DoctorUpdateData):
    existing_data = await Doctor.get_or_none(id=id).values()
    if not existing_data:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if not any(value is not None for value in updated_data.model_dump(exclude_unset=True).values()):
        raise HTTPException(status_code=400, detail="No valid fields provided for update")
    await Doctor.filter(id=id).update(**updated_data.model_dump(exclude_unset=True))
    print(id, type(updated_data))
    return {"msg":"doctor updated succssfully", "doctor_id": id}

@router.delete("/doctor/{id}")
async def delete_doctor(id):
    doctor = await Doctor.get_or_none(id=id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    await doctor.delete()

    return {"msg": "doctor deleted successfully", "doctor_id": id}


# /admin/receptionist 

@router.get("/receptionist/{id}", response_model=Receptionist_Pydantic)
async def read_receptionist_data(id):
    receptionist_data = await Receptionist.get_or_none(id=id).values()
    if not receptionist_data:
        raise HTTPException(status_code=404, detail="Receptionist not found")
    return receptionist_data




class ReceptionistCreateData(BaseModel):
    name: str
    email: str
    phone: str 


@router.post("/receptionist")
async def add_receptionist(receptionist_data: ReceptionistCreateData):
    try:
        await Receptionist.create(
            name=receptionist_data.name,
            email=receptionist_data.email,
            phone=receptionist_data.phone
        )

        return {"msg": "receptionist created"}

    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))


class ReceptionistUpdateData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None 


@router.post("/update/receptionist/{id}")
async def update_receptionist(id, updated_data: ReceptionistUpdateData):
    existing_data = await Receptionist.get_or_none(id=id).values()
    if not existing_data:
        raise HTTPException(status_code=404, detail="Receptionist not found")

    if not any(value is not None for value in updated_data.model_dump(exclude_unset=True).values()):
        raise HTTPException(status_code=400, detail="No valid fields provided for update")

    await Receptionist.filter(id=id).update(**updated_data.model_dump(exclude_unset=True))
    print(id, type(updated_data))
    return {"msg":"receptionist updated succssfully", "receptionist_id": id}


@router.delete("/receptionist/{id}")
async def delete_receptionist(id):
    receptionist = await Receptionist.get_or_none(id=id)
    if not receptionist:
        raise HTTPException(status_code=404, detail="Doctor not found")
    await receptionist.delete()

    return {"msg": "receptionist deleted successfully", "receptionist_id": id}