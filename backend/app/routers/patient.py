from typing import Optional
from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from app.database import GenderEnum, Patient, Patient_Pydantic

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
