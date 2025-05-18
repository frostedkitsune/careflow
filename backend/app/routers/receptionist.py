from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import Appointment, Appointment_Pydantic, Doctor_Pydantic, Patient_Pydantic, Receptionist, Receptionist_Pydantic, Slot_Pydantic

router = APIRouter(prefix="/receptionist", tags=["receptionist"])


# route /me(GET)
@router.get(path="/me", response_model=Receptionist_Pydantic)
async def get_receptionist_data():
    receptionist = await Receptionist.get_or_none(id=1).values()
    return receptionist


# model for create receptionist
class ReceptionistCreateData(BaseModel):
    name: str
    email: str
    phone: str


# route /me(POST)
@router.post(path="/me")
async def add_receptionist(receptionist_data: ReceptionistCreateData):
    await Receptionist.create(
        name=receptionist_data.name,
        email=receptionist_data.email,
        phone=receptionist_data.phone,
    )
    # print(receptionist_data)
    return {"msg": "receptionist created"}

# route for get all apppointment
@router.get("/appointment", summary="Get all appointments with full details")
async def get_all_appointments():
    appointments = await Appointment.all().prefetch_related("patient_id", "doctor_id", "slot_id")

    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found")

    results = []
    for appt in appointments:
        appt_data = await Appointment_Pydantic.from_tortoise_orm(appt)
        patient = await Patient_Pydantic.from_tortoise_orm(appt.patient_id)
        doctor = await Doctor_Pydantic.from_tortoise_orm(appt.doctor_id)
        slot = await Slot_Pydantic.from_tortoise_orm(appt.slot_id)

        results.append({
            "appointment": appt_data,
            "patient": patient,
            "doctor": doctor,
            "slot": slot
        })

    return results

# get a single appointment by id
@router.get("/appointment/{id}", summary="Get single appointment with full details")
async def get_appointment_by_id(id: int):
    appointment = await Appointment.get_or_none(id=id).prefetch_related("patient_id", "doctor_id", "slot_id")
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt_data = await Appointment_Pydantic.from_tortoise_orm(appointment)
    patient = await Patient_Pydantic.from_tortoise_orm(appointment.patient_id)
    doctor = await Doctor_Pydantic.from_tortoise_orm(appointment.doctor_id)
    slot = await Slot_Pydantic.from_tortoise_orm(appointment.slot_id)

    return {
        "appointment": appt_data,
        "patient": patient,
        "doctor": doctor,
        "slot": slot
    }