from typing import List
from fastapi import APIRouter, Form, Request, UploadFile
from fastapi.exceptions import HTTPException
from pydantic import BaseModel 
import os
import uuid


from app.database import Appointment, Appointment_Pydantic, AppointmentStatusEnum, Doctor, Doctor_Pydantic, GenderEnum, Patient, Patient_Pydantic, Records, Records_Pydantic, Slot_Pydantic

router = APIRouter(prefix="/patient", tags=["patient"]) 

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

# For storing the PDF file
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


# route /doctor(GET)
@router.get("/doctors", summary="Get all doctor IDs with names")
async def get_all_doctors():
    doctors = await Doctor.all().values("id", "name", "specialization")
    return {"doctors": doctors}


class AppointmentCreateData(BaseModel):
    doctor_id: int
    receptionist_id: int | None = None
    slot_id: int
    appointment_date: str  # Format: "YYYY-MM-DD"
    reason: str
    record_ids: List[int]


@router.post("/appointment", response_model=Appointment_Pydantic)
async def create_appointment(data: AppointmentCreateData):
    # Get the last ID
    last = await Appointment.all().order_by("-id").first()
    next_id = (last.id + 1) if last else 1

    patient_id = 1  # hardcoded


    appointment = await Appointment.create(
            id=next_id,
            patient_id_id=patient_id,
            doctor_id_id=data.doctor_id,
            receptionist_id_id=data.receptionist_id,
            slot_id_id=data.slot_id,
            appointment_date=data.appointment_date,
            reason=data.reason,
            record_ids=data.record_ids,
            status=AppointmentStatusEnum.PENDING,
        )

    return await Appointment_Pydantic.from_tortoise_orm(appointment)


@router.get("/appointment", summary="Get all appointments for the current patient")
async def get_patient_appointments():
    patient_id = 1  # Replace with authenticated patient ID

    appointments = await Appointment.filter(
        patient_id=patient_id,
    ).prefetch_related("slot_id", "doctor_id")

    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this patient")

    results = []
    for appt in appointments:
        slot = await Slot_Pydantic.from_tortoise_orm(appt.slot_id)
        doctor = await Doctor_Pydantic.from_tortoise_orm(appt.doctor_id)
        appt_data = await Appointment_Pydantic.from_tortoise_orm(appt)

        results.append({
            "appointment": appt_data,
            "slot": slot,
            "doctor": doctor
        })

    return results


