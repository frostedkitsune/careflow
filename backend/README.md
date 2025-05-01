<center>

# Careflow Backend

[![python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.11-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![uv](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/uv/main/assets/badge/v0.json)](https://github.com/astral-sh/uv)

</center>

## setting dev environment

### 1. clone the repo:

```sh
git clone <repo-url>
```

### 2. setup virtual environment:

this will create a virtual environment and install the necessary dependencies

> [!IMPORTANT]
> you need to have [uv](https://docs.astral.sh/uv/) installed for this

```sh
uv sync
```

### 3. set up the environment variables:

copy the template env file and fill the necessary

> [!IMPORTANT]
> connection string should start with `postgres` not `postgresql`

```sh
cp .env.template .env
```

### 4. run the dev server:

```sh
uvicorn app.main:app --env-file .env --reload --reload-delay 1.0
```

> [!TIP]
> a function/alias can be added to the respective activate scripts
> to save from typing this long command
>
> for bash append this to .venv > bin > activate
> ```bash
> alias runcfb="uvicorn app.main:app --env-file .env --reload --reload-delay 1.0"
> ```
>
> for powershell append this to .venv > bin > activate.ps1
> ```pwsh
> function runcfb {
>    uvicorn app.main:app --env-file .env --reload --reload-delay 1.0
>}
> ```
