# Notes App - REST API with Auth & CRUD

A full-stack notes application demonstrating secure authentication and CRUD operations for Notes.

- **Live Demo:** https://notes-add-app.netlify.app
- **API Base URL:** https://notes-app-production-c23f.up.railway.app
- **API Documentation:** https://documenter.getpostman.com/view/17086606/2sBXqFNNCY

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, JWT (HS256)
- **Frontend:** React (Vite), Tailwind CSS, Context API
- **Database:** PostgreSQL (Railway)
- **Deployment:** Railway (backend), Netlify (frontend)

## Features
- User registration and login with JWT authentication
- Protected routes - token required for all note operations
- Full CRUD for notes (create, read, update, delete)
- Stale update prevention using `updated_at` timestamp (returns 409 on conflict)
- Input validation with structured error responses(404, 409, 422)

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Copy .env.example to .env and fill in values
uvicorn app.main:app --reload --env-file .env
```

### Database Setup
Tables are created via SQLAlchemy. In `backend/app/main.py`, 
uncomment this line once before first run:
```python
Base.metadata.create_all(bind=engine)
```
Then comment it out again after tables are created.

### Frontend
```bash
cd frontend
npm install
# Copy .env.example to .env and fill in values
npm run dev
```

## API Overview

### Auth
| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Register new user  |
| POST   | /auth/login    | Login, returns JWT |

### Notes (all require Authorization header)
**Example Authorization Header:**
```
Authorization: Bearer <your_token>
```

| Method | Endpoint    | Description            |
| ------ | ----------- | ---------------------- |
| GET    | /notes      | Get all notes for user |
| POST   | /notes      | Create new note        |
| PUT    | /notes/{id} | Update note            |
| DELETE | /notes/{id} | Delete note            |

Full request/response examples in Postman collection: `/docs/postman-collection.json`

## Scalability Notes
- Stateless JWT auth scales horizontally with no session store
- PostgreSQL schema supports additional entities with minimal changes
- Redis caching can be added for frequently accessed note lists
- Project structure is modular - new feature modules drop into `/app` cleanly

## Future Improvements
- Role-based access (admin vs user) can be added by extending the User model with a `role` field and enforcing route-level permissions.
- Can be containerized with Docker for consistent deployment

## Author
Kriti Shrivastav