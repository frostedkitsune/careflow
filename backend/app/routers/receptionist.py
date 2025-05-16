from fastapi import APIRouter
from pydantic import BaseModel

from app.database import Receptionist, Receptionist_Pydantic

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
