from fastapi import APIRouter, Path
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

# import the Model
from app.database import Appointment, Doctor, Doctor_Pydantic, Records

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


#route /record/{patient_id}/{appointment_id}(GET)
@router.get(
    "/record/{patient_id}/{appointment_id}",
    summary="Get patient record for specific appointment"
)
async def get_patient_record(
    patient_id: int = Path(..., description="ID of the patient"),
    appointment_id: int = Path(..., description="ID of the appointment")
):
    try:
        # First get the appointment to check record_ids
        appointment = await Appointment.filter(
            id=appointment_id,
            patient_id=patient_id
        ).first().values()
        
        if not appointment:
            raise HTTPException(
                status_code=404,
                detail="Appointment not found for this patient"
            )
        
        # Get record_ids from appointment (assuming it's a list of IDs)
        record_ids = appointment.get('record_ids', [])
        if not record_ids:
            raise HTTPException(
                status_code=404,
                detail="No records found for this appointment"
            )
        
        # Get the first record (or modify to handle multiple records)
        record = await Records.filter(
            id=record_ids[0],
            patient_id=patient_id
        ).first().values()
        
        if not record:
            raise HTTPException(
                status_code=404,
                detail="Record not found"
            )
            
        return record
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))