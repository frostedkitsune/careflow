from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.database import Admin, Admin_Pydantic

router = APIRouter(prefix="/admin", tags=["admin"])

class AdminCreatedResponse(BaseModel):
    msg: str

@router.get("/me", response_model=AdminCreatedResponse)
async def read_profile_data() -> AdminCreatedResponse:
    # data = await Admin.create(username="demouser", name="Demo User", password_hash="securepasshash")
    # print(data)
    # return await Admin_Pydantic.from_tortoise_orm(data)
    return JSONResponse({ "msg": "admin created" }, status.HTTP_200_OK) 
