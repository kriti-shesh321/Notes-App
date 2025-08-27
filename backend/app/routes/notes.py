from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timezone

from ..db import get_db
from ..models import Note
from ..utils.schema import NoteCreate, NoteUpdate, NoteOut
from ..utils.auth import get_current_user
from ..models import User

router = APIRouter(prefix="/notes", tags=["notes"])

@router.get("", response_model=list[NoteOut])
def list_notes(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(Note).filter(Note.user_id == user.id).order_by(Note.id.desc()).all()
    return rows

@router.post("", response_model=NoteOut, status_code=201)
def create_note(payload: NoteCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = Note(user_id=user.id, title=payload.title, content=payload.content or "")
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, payload: NoteUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Stale note checking
    if note.updated_at and payload.updated_at.replace(tzinfo=timezone.utc) < note.updated_at:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Stale update. Reload the note.")

    note.title = payload.title
    note.content = payload.content or ""
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return