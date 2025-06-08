from typing import List, Optional
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from datetime import date

from app.database import Appointment, Appointment_Pydantic, AppointmentStatusEnum, Doctor, Doctor_Pydantic, Patient_Pydantic, Receptionist, Receptionist_Pydantic, Slot, Slot_Pydantic

router = APIRouter(prefix="/receptionist", tags=["receptionist"])


# route /me(GET)
@router.get(path="/me", response_model=Receptionist_Pydantic)
async def get_receptionist_data():
    receptionist = await Receptionist.get_or_none(id=1).values()
    return receptionist


# route /doctor(GET)
@router.get("/doctors", summary="Get all doctor IDs with names")
async def get_all_doctors():
    doctors = await Doctor.all().values("id", "name", "specialization")
    return {"doctors": doctors}


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

# Fetch all slots for a specific doctor
@router.get("/doctor/slots/{doctor_id}", summary="Get all slots of a specific doctor")
async def get_doctor_slots(doctor_id: int):
    slots = await Slot.filter(doctor_id=doctor_id).all().values("id", "available", "day", "slot_time")
    if not slots:
        raise HTTPException(status_code=404, detail="No slots found for this doctor")
    return {"doctor_id": doctor_id, "slots": slots}

# slot model for update or create new slot
class SlotUpdateModel(BaseModel):
    id: Optional[int] = None
    slot_time: Optional[str] = None
    day: Optional[str] = None
    available: Optional[bool] = None


@router.patch("/doctor/slots/{doctor_id}", summary="Update or create slots for a doctor")
async def update_or_create_slots(doctor_id: int, updates: List[SlotUpdateModel]):
    updated_slots = []

    # Get the current max ID in Slot table
    max_id_record = await Slot.all().order_by("-id").first()
    current_max_id = max_id_record.id if max_id_record else 0

    for update in updates:
        if update.id is not None:
            # Update existing slot
            slot = await Slot.get_or_none(id=update.id, doctor_id=doctor_id)
            if not slot:
                continue

            if update.available is not None:
                slot.available = update.available
            if update.slot_time is not None:
                slot.slot_time = update.slot_time
            if update.day is not None:
                slot.day = update.day

            await slot.save()
            updated_slots.append(await Slot_Pydantic.from_tortoise_orm(slot))
        else:
            # Create new slot with manual ID
            current_max_id += 1
            new_slot = await Slot.create(
                id=current_max_id,
                doctor_id_id=doctor_id,
                slot_time=update.slot_time,
                day=update.day,
                available=update.available,
            )
            updated_slots.append(await Slot_Pydantic.from_tortoise_orm(new_slot))

    if not updated_slots:
        raise HTTPException(status_code=400, detail="No slots were updated or created")

    return {"msg": "Slots updated/created successfully", "slots": updated_slots}

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

@router.patch("/appointment/status", summary="Update appointment status (approve, decline, or re-approve)")
async def update_appointment_status(
    appointment_id: int = Body(..., embed=True),
    action: str = Body(..., embed=True)  # "approve", "decline", or "re-approve"
):

    # hardcoded receptionist id, later change it
    receptionist_id = 1

    # Get the appointment
    appointment = await Appointment.get_or_none(id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Validate action
    action = action.lower()
    if action == "approve":
        appointment.status = AppointmentStatusEnum.DONE
    elif action == "decline":
        appointment.status = AppointmentStatusEnum.REJECTED
    elif action == "re-approve":
        appointment.status = AppointmentStatusEnum.PENDING
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'approve', 'decline', or 're-approve'.")

    # Assign receptionist
    appointment.receptionist_id_id = receptionist_id 

    await appointment.save()
    return {"msg": "Appointment status updated successfully"}

# reschedule the appointment
@router.patch("/appointment/reschedule", summary="Reschedule an appointment")
async def reschedule_appointment(
    appointment_id: int = Body(..., embed=True),
    date: date = Body(..., embed=True)
):
    # Get the appointment
    appointment = await Appointment.get_or_none(id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Update the reschedule date
    appointment.reschedule_date = date
    await appointment.save()

    return {"msg": "Appointment rescheduled successfully"}


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

