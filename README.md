# Hire a Human Backend (Scratch)

A FastAPI backend for a hiring marketplace where:
- engineers create profiles and become searchable,
- recruiters sign up and must be admin-verified,
- admins review recruiter accounts.

The project uses PostgreSQL with asyncpg, JWT-based authentication, and role-based route guards.

## Tech Stack

- Python 3.11+
- FastAPI
- asyncpg (PostgreSQL)
- Pydantic v2
- python-jose (JWT)
- passlib + bcrypt

## Project Structure

```
.
|-- main.py
|-- src/
|   |-- auth.py
|   |-- config.py
|   |-- database.py
|   |-- models/
|   |-- repositories/
|   `-- routers/
|-- database/
|   |-- schema.sql
|   `-- triggers.sql
|-- docs/
`-- test.py
```

## Features

- Engineer account creation and login
- Recruiter account creation and login
- Admin login
- Admin review workflow for recruiter verification
- Filtered engineer search with relevance scoring
- JWT role checks for admin, recruiter, and engineer routes

## Prerequisites

- Python 3.11+
- PostgreSQL 14+ (recommended)

## Environment Variables

Create a `.env` file in the project root:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hire_a_human
```

Notes:
- The app loads `.env` from project root in `src/database.py`.
- JWT settings are currently hardcoded in `src/config.py`.

## Installation

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Or with `pyproject.toml`:

```bash
pip install .
```

## Database Setup

1. Create the database in PostgreSQL:

```sql
CREATE DATABASE hire_a_human;
```

2. Apply schema:

```bash
psql -U postgres -d hire_a_human -f database/schema.sql
```

3. Apply triggers:

```bash
psql -U postgres -d hire_a_human -f database/triggers.sql
```

4. Seed at least one admin user (required for admin login):

```sql
INSERT INTO admins (email, password_hash)
VALUES (
	'admin@example.com',
	'$2b$12$Jrj4dNo1W0u9z6P8k2xM4u8H0VQw3f5c8Jq0F0N8xM8l2aVvV1r9K'
);
```

Replace `password_hash` with a bcrypt hash generated for your desired password.

## Running the API

```bash
uvicorn main:app --reload
```

Default docs URLs:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## API Overview

### Recruiters

- `POST /recruiters/` : Recruiter signup
- `POST /recruiters/login` : Recruiter login (blocked if verification status is rejected)

### Engineers

- `POST /engineers/` : Engineer signup
- `GET /engineers/` : List engineers
- `POST /engineers/login` : Engineer login
- `PUT /engineers/{engineer_id}` : Update engineer profile (guarded)
- `POST /engineers/search` : Search engineers with filters and relevance scoring (recruiter-only)

### Admin

- `POST /admin/login` : Admin login
- `POST /admin/review-recruiter/{recruiter_id}` : Approve/reject recruiter (admin-only)

## Authentication

JWT tokens include role data and are validated in route dependencies in `src/auth.py`.

Use this header for protected endpoints:

```http
Authorization: Bearer <access_token>
```

Behavior summary:
- Admin routes require `role = admin`
- Recruiter-protected routes require `role = recruiter` and `verification_status = verified`
- Engineer-protected routes require `role = engineer`

## Example Flow

1. Sign up recruiter via `POST /recruiters/`
2. Log in as admin via `POST /admin/login`
3. Verify recruiter via `POST /admin/review-recruiter/{recruiter_id}`
4. Log in recruiter via `POST /recruiters/login`
5. Search engineers via `POST /engineers/search`

## Development Notes

- Connection pool is created during FastAPI lifespan startup (`main.py`).
- SQL is repository-based (`src/repositories/*_repo.py`).
- Data contracts are defined in Pydantic models under `src/models`.

## Current Limitations

- No migration framework yet (raw SQL files are used)
- No automated tests wired to CI yet
- JWT config values are hardcoded

## License

No license file is currently included.
