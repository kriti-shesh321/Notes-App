# Notes App — React + FastAPI + Postgres

A small, end-to-end notes app to demonstrate **auth + CRUD** with a clean, minimal stack.

[🌐 Live Demo (Netlify)](https://notes-add-app.netlify.app)

- **Frontend:** React (Vite) + Tailwind v3 + Context API  
- **Backend:** FastAPI + SQLAlchemy + JWT (HS256)  
- **DB:** PostgreSQL (hosted on Railway). Works locally too.

I focused on delivering something simple: register/login and list/create/edit/delete notes.

---

## Why this stack

**JWT auth** over cookies/OAuth because it’s:
- **Stateless & simple** — FastAPI just verifies the token each request; no server session store.
- **SPA-friendly** — `Authorization: Bearer <token>` fits nicely with `fetch`.
- **Fast to demo** — no OAuth client IDs/redirects or CSRF wiring.

---

## What’s implemented

- Register → Login → store JWT (using Context API + localStorage)  
- Notes: list, create, edit, delete (for logged in users)  
- **Stale Note Update Prevention** - on update using `updated_at`, prevents stale overwrites (returns **409** if the note is old)

---

## Quick start

### 1) Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate           # Windows: venv\Scripts\Activate.ps1
pip install -r requirements.txt    
```

Create `.env` (example): use .env.example as reference

Run:
```bash
uvicorn app.main:app --reload --env-file .env
```

> Tables are created on startup via `Base.metadata.create_all(...)` - uncomment that line from main.py file.  
> Once confirmed in DB, you can comment that line out.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Tailwind v3 is pre-wired. App runs on `http://localhost:5173`. 

---

## API (shapes you can count on)

**All `/notes` routes require**: `Authorization: Bearer <token>`

### Auth
`POST /auth/register`  
**req**:
```json
{ "username": "JOhn", "password": "secret" }
```
**res**:
```json
{ "id": "uuid", "username": "John" }
```

`POST /auth/login`  
**req**:
```json
{ "username": "John", "password": "secret" }
```
**res**:
```json
{ "access_token": "JWT", "token_type": "bearer" }
```

### Notes
`GET /notes`  
**res**:
```json
[
  { "id": 3, "title": "Hello", "content": "World", "updated_at": "2025-08-27T12:10:15.123456+00:00" }
]
```

`POST /notes`  
**req**:
```json
{ "title": "New", "content": "Optional" }
```
**res**:
```json
{ "id": 4, "title": "New", "content": "Optional", "updated_at": "..." }
```

`PUT /notes/{id}` 
**req**:
```json
{
  "title": "Updated",
  "content": "Changed",
  "updated_at": "2025-08-27T12:10:15.123456+00:00" 
}
```
**res**:
```json
{ "id": 4, "title": "Updated", "content": "Changed", "updated_at": "server time" }
```
**on stale note update**: `409 Conflict`.

`DELETE /notes/{id}` → `204 No Content`

---

## 🧑‍💻 Author

Made by Kriti Shrivastav — feel free to connect!