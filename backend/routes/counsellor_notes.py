from fastapi import APIRouter,Request,HTTPException
from database import supabase
from models.coun_notes import note_entry,GetNotes
router=APIRouter(prefix="/counsellor_notes",tags=["counsellor_notes"])
def get_counsellor_name(mail: str) -> str:
    counsellor_map = {
        "akashreddy0314@gmail.com": "Akash",
        "1602-24-733-156@vce.ac.in": "Prem",
        "dhanushsoma2006@gmail.com": "Dhanush"
    }

    return counsellor_map.get(mail, "Unknown Counsellor")

@router.post("/add_notes")
def add_note(note: note_entry, request: Request):
    mail=request.cookies.get("user_mail")
    if not mail:
        raise HTTPException(status_code=401, detail="please log in ")
    if mail!=note.counsellor_mail:
        raise HTTPException(status_code=403, detail="forbidden action")
    try:
        supabase.table("counselling_notes").insert({
            "counsellor_mail": note.counsellor_mail,
            "student_mail": note.student_mail,
            "notes": note.note
        }).execute()
        return {"message":"notes added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"failed to add notes {str(e)}")
@router.post("/get_notes")
def get_notes(data: GetNotes, request: Request):
    mail = request.cookies.get("user_mail")

    if not mail:
        raise HTTPException(status_code=401, detail="please log in")

    if mail != data.counsellor_mail:
        raise HTTPException(status_code=403, detail="forbidden action")

    try:
        res = (
            supabase
            .table("counselling_notes")
            .select("counsellor_mail, notes, created_at")
            .eq("student_mail", data.student_mail)
            .order("created_at", desc=True)
            .execute()
        )

        notes_response = [
            {
                "counsellor_name": get_counsellor_name(entry["counsellor_mail"]),
                "notes": entry["notes"],
                "created_at": entry["created_at"]
            }
            for entry in (res.data or [])
        ]

        return {"notes": notes_response}

    except Exception:
        raise HTTPException(status_code=500, detail="failed to fetch notes")
