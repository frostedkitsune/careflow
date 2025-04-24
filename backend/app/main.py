import os

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles
from tortoise import Tortoise, generate_config
from tortoise.contrib.fastapi import RegisterTortoise, tortoise_exception_handlers

from app.database import Admin
from app.routers import admin

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    config = generate_config(
        db_url=os.getenv("POSTGRES_URL", "<postgres-connection-string>"),
        app_modules={"models": ["app.database"]},
        testing=True,
        connection_label="postgresrailway",
    )
    async with RegisterTortoise(
        app=app,
        config=config,
        generate_schemas=True,
        # _create_db=True,
    ):
        # db connected
        yield
        # app teardown
    # db connections closed
    await Tortoise._drop_databases()

app = FastAPI(lifespan=lifespan, exception_handlers=tortoise_exception_handlers(), root_path='/api/v1')

@app.get("/")
def read_root() -> PlainTextResponse:
    return PlainTextResponse("careflow backend api v1.0", status.HTTP_200_OK)

#add routes here
app.include_router(admin.router)


# app.mount("/", StaticFiles(directory="static"), "static")
