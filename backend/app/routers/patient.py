from typing import Optional
from fastapi import APIRouter, Form, Request, UploadFile
from fastapi.exceptions import HTTPException
from pydantic import BaseModel 
import os
import uuid

from app.database import Appointment, Appointment_Pydantic, Doctor, Doctor_Pydantic, GenderEnum, Patient, Patient_Pydantic, Records, Records_Pydantic

router = APIRouter(prefix="/patient", tags=["patient"]) 

@router.get("/createz")
async def creating_test_patient():
    _data1 = await Patient.create(
        username="userhot",
        name="User Hot",
        password_hash="cool",
        email="user@hot.email",
        phone="012-345-6789",
        dob="1990-01-01",
        gender=GenderEnum.MALE,
        address="123 Demo St, Demo City",
        emergency_person="John Hot",
        emergency_relation="Brother",
        emergency_number="098-765-4321"
    )

    _data2 = await Patient.create(
        username="usercool",
        name="User Cool",
        password_hash="hot",
        email="user@cool.email",
        phone="987-654-3210",
        dob="1992-02-02",
        gender=GenderEnum.FEMALE,
        address="456 Sample Ave, Sample Town",
        emergency_person="Jane Cool",
        emergency_relation="Sister",
        emergency_number="123-456-7890"
    )

    return "ok"

@router.get("/me")
async def read_profile_data():
    patient_data = await Patient.get(id=1)
    return patient_data


@router.post("/me",)
async def update_profile_data(patient_data: Patient_Pydantic):
    patient = await Patient.get(id=1)

    print(patient_data)

    return {"msg": "updated details"}


# GET /patient/record - Get all records for patient with id=1
@router.get("/record", response_model=list[Records_Pydantic])
async def get_patient_records():
    patient_id = 2  # hardcoded for now

    records = await Records_Pydantic.from_queryset(
        Records.filter(patient_id=patient_id)
    )

    if not records:
        raise HTTPException(status_code=404, detail="No records found for this patient.")

    return records

UPLOAD_DIR = "uploaded_records"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# POST /record - Upload record
@router.post("/record", summary="Upload a patient record with manual ID")
async def create_patient_record(
    request: Request,
    reason: str = Form(...),
    file: UploadFile = Form(...),
):
    # Hardcoded patient_id for now
    patient_id = 1

    # Validate patient exists
    patient = await Patient.get_or_none(id=patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Save file locally
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Generate public file URL
    file_url = f"{request.base_url}uploaded_records/{filename}"

    # Get next ID manually
    last_record = await Records.all().order_by("-id").first()
    next_id = (last_record.id + 1) if last_record else 1

    record = await Records.create(
            id=next_id,
            reason=reason,
            record_data=file_url,
            patient_id_id=patient_id,  # correct way to manually assign FK by ID
            doctor_id=None             # optional for now
        )
    

    return await Records_Pydantic.from_tortoise_orm(record)


# DELETE /record - Remove records
@router.delete("/record/{id}")
async def remove_record(id: int):
    record = await Records.get_or_none(id=id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    await record.delete()
    return {"msg": "Record deleted successfully", "record_id": id}


# GET /appointment?status=booked - Fetch appointments
@router.get("/appointment")
async def fetch_appointments():
    HARD_CODED_PATIENT_ID = 1 
    appointments = await Appointment.filter(patient_id=HARD_CODED_PATIENT_ID).values()
    
    return appointments

# GET /appointment/{id} - Fetch appointment details
@router.get("/appointment/{id}")
async def fetch_appointment_details(id: int):
    appointment = await Appointment.get_or_none(id=id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return await Appointment_Pydantic.from_tortoise_orm(appointment)

# POST /appointment/ - Book appointment
class AppointmentRequestBody(BaseModel):
    patient_id: int
    doctor_id: int
    receptionist_id: Optional[int] = None
    slot_id: int
    appointment_date: str
    reason: str

@router.post("/appointment")
async def book_appointment(appointment: AppointmentRequestBody):
    appointment_obj = await Appointment.create(**appointment.dict(exclude_unset=True))
    return await Appointment_Pydantic.from_tortoise_orm(appointment_obj)

# POST /appointment/{id} - Edit appointment
class AppointmentUpdateRequestBody(BaseModel):
    status: Optional[str] = None
    reschedule_date: Optional[str] = None
    reason: Optional[str] = None

@router.post("/appointment/{id}")
async def edit_appointment(id: int, appointment_update: AppointmentUpdateRequestBody):
    appointment = await Appointment.get_or_none(id=id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment_data = appointment_update.dict(exclude_unset=True)
    for key, value in appointment_data.items():
        setattr(appointment, key, value)
    
    await appointment.save()
    return await Appointment_Pydantic.from_tortoise_orm(appointment)

# DELETE /appointment/{id} - Cancel appointment
@router.delete("/appointment/{id}")
async def cancel_appointment(id: int):
    appointment = await Appointment.get_or_none(id=id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    await appointment.delete()
    return {"msg": "Appointment canceled successfully", "appointment_id": id}


# GET /doctor/{category} - Fetch doctors
@router.get("/doctor/{category}", response_model=list[Doctor_Pydantic])
async def fetch_doctors(category: str):
    doctors = await Doctor.filter(specialization=category).values()
    if not doctors:
        raise HTTPException(status_code=404, detail="No doctors found in this category")
    return doctors