from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from pydantic import BaseModel

# import the Model
from app.database import Appointment, Doctor, Patient_Pydantic, Prescription

# router
router = APIRouter(prefix="/prescription", tags=["prescription"])

# route for get all prescription for the doctor
@router.get("/all", summary="Get all prescriptions for a specific doctor")
async def get_prescriptions_by_doctor_id():
    doctor_id = 1  # replace later with real doctor_id from token
    # Check if doctor exists
    doctor = await Doctor.get_or_none(id=doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Get all appointments by doctor
    appointments = await Appointment.filter(doctor_id=doctor_id).prefetch_related(
        "patient_id"
    )
    if not appointments:
        raise HTTPException(
            status_code=404, detail="No appointments found for this doctor"
        )

    results = []
    for appt in appointments:
        prescription = await Prescription.get_or_none(appointment_id=appt.id)
        if prescription:
            patient = await Patient_Pydantic.from_tortoise_orm(appt.patient_id)
            results.append(
                {
                    "prescription": {
                        "id": prescription.id,
                        "appointment_id": appt.id,
                        "observation": prescription.observation,
                        "medication": prescription.medication,
                        "advise": prescription.advise,
                        "test": prescription.test,
                    },
                    "patient": patient,
                }
            )

    if not results:
        raise HTTPException(
            status_code=404, detail="No prescriptions found for this doctor"
        )

    return results


# route for get the prescription result by appointmentID
@router.get(
    "/{appointment_id}", summary="Get prescription details with Patient Details"
)
async def get_prescription_details_by_appointment(appointment_id: int):
    # Get the appointment
    appointment = await Appointment.get_or_none(id=appointment_id).prefetch_related(
        "patient_id"
    )
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Get the prescription
    prescription = await Prescription.get_or_none(appointment_id=appointment_id)
    if not prescription:
        raise HTTPException(
            status_code=404, detail="Prescription not found for this appointment"
        )

    # Get patient and prescription data
    patient = await Patient_Pydantic.from_tortoise_orm(appointment.patient_id)
    prescription_data = {
        "id": prescription.id,
        "observation": prescription.observation,
        "medication": prescription.medication,
        "advise": prescription.advise,
        "test": prescription.test,
    }

    return {"patient": patient, "prescription": prescription_data}


# model for create prescription
class PrescriptionCreateData(BaseModel):
    appointment_id: int
    observation: str
    medication: str
    advise: str
    test: str


# route for create prescription
@router.post("/create")
async def create_prescription(prescription_data: PrescriptionCreateData):
    await Prescription.create(
        appointment_id=prescription_data.appointment_id,
        observation=prescription_data.observation,
        medication=prescription_data.medication,
        advise=prescription_data.advise,
        test=prescription_data.test,
    )

    return {"msg": "prescription created"}
