import logging
import os

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles
from tortoise import Tortoise
from tortoise.backends.base.config_generator import generate_config
from tortoise.contrib.fastapi import RegisterTortoise, tortoise_exception_handlers

from app.routers import admin, patient, record

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("tortoise")

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    config = generate_config(
        db_url=os.getenv(
            "POSTGRES_URL",
            "This string should not be accessed!",
        ),
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
    await Tortoise.close_connections()


app = FastAPI(
    lifespan=lifespan,
    exception_handlers=tortoise_exception_handlers(),
    root_path="/api/v1",
)


@app.get("/")
def read_root() -> PlainTextResponse:
    return PlainTextResponse("careflow backend api v1.0", status.HTTP_200_OK)


# add routes here
app.include_router(admin.router)
app.include_router(patient.router)
app.include_router(record.router)


app.mount("/", StaticFiles(directory="static"), "static")
