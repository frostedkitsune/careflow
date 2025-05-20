from fastapi import APIRouter, Path
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

# import the Model
from app.database import Appointment, Appointment_Pydantic, AppointmentStatusEnum, Doctor, Doctor_Pydantic, Patient_Pydantic, Records, Slot_Pydantic

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


@router.get("/appointments", summary="Get all appointments for the current doctor")
async def get_doctor_appointments():
    doctor_id = 2  # Replace this with real authenticated doctor ID
    
    # Filter by doctor_id and status in ("BOOKED", "DONE")
    appointments = await Appointment.filter(
        doctor_id=doctor_id,
        status__in=["BOOKED", "DONE"]
    ).prefetch_related("slot_id", "patient_id")
    
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this doctor")
    
    results = []
    for appt in appointments:
        slot = await Slot_Pydantic.from_tortoise_orm(appt.slot_id)
        patient = await Patient_Pydantic.from_tortoise_orm(appt.patient_id)
        appt_data = await Appointment_Pydantic.from_tortoise_orm(appt)

        results.append({
            "appointment": appt_data,
            "slot": slot,
            "patient": patient
        })

    return results

@router.patch("appointment/{appointment_id}", summary="Mark appointment as DONE if it's currently BOOKED")
async def mark_appointment_completed(
    appointment_id: int = Path(..., description="ID of the appointment")
):
    appointment = await Appointment.get_or_none(id=appointment_id)

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if appointment.status != AppointmentStatusEnum.BOOKED:
        raise HTTPException(
            status_code=400,
            detail=f"Appointment status is '{appointment.status}', not 'BOOKED'"
        )

    appointment.status = AppointmentStatusEnum.DONE
    await appointment.save()

    return {"msg": "Appointment marked as DONE"}