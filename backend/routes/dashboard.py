from fastapi import APIRouter,Response,HTTPException,Request
from database import supabase
router=APIRouter(prefix="/dashboard",tags=["dashboard"])
##streak calculation function

from datetime import datetime, timedelta, timezone, date

def calculate_streak(email: str) -> int:
    today = datetime.now(timezone.utc).date()

    res = (
        supabase
        .table("user_streaks")
        .select("streak, last_visited")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    if not res.data:
        supabase.table("user_streaks").insert({
            "email": email,
            "streak": 1,
            "last_visited": today.isoformat()
        }).execute()
        return 1

    user = res.data[0]
    last_visited = date.fromisoformat(user["last_visited"])
    streak = user["streak"]

    if last_visited == today:
        return streak

    if last_visited == today - timedelta(days=1):
        streak += 1
    else:
        streak = 1

    supabase.table("user_streaks").update({
        "streak": streak,
        "last_visited": today.isoformat()
    }).eq("email", email).execute()

    return streak


#fetch upcoming appointments 
def fetch_upcoming_appointments(mail: str):
    from datetime import date
    today = date.today().isoformat()
    z=supabase.table("appointments").select("*").eq("student_mail", mail).eq("appointment_date", today).execute()
    if not z.data:
        return None
    return z.data[0]

@router.get("/")
def get_dashboard(request: Request):
    mail = request.cookies.get("user_mail")
    if not mail:
        raise HTTPException(status_code=401, detail="please log in ")
    streak=calculate_streak(mail)
    x=fetch_upcoming_appointments(mail)
    return {"streak":streak,"upcoming_appointment":x}
    

    