from fastapi import APIRouter, HTTPException, status,Request,Response
from models.cancel_appo import cancel
from database import supabase
from datetime import time
from fastapi.responses import JSONResponse
router = APIRouter(prefix="/cancel_appointment", tags=["cancel_appointment"])
def get_time(slot_column: str) -> str:
    slot_times = {
        "slot1": time(9, 0).strftime("%H:%M:%S"),
        "slot2": time(11, 0).strftime("%H:%M:%S"),
        "slot3": time(13, 0).strftime("%H:%M:%S"),
        "slot4": time(15, 0).strftime("%H:%M:%S"),
        "slot5": time(17, 0).strftime("%H:%M:%S"),
    }
    return slot_times.get(slot_column)
@router.post("/")
def cancel_appointment(details: cancel, request: Request):
    mail=request.cookies.get("user_mail")
    if not mail:
        raise HTTPException(status_code=401, detail="please login to proceed")
    if mail != details.student_mail:
        raise HTTPException(status_code=403, detail="unauthorized action")
    slot_time = get_time(details.slot)
    if not slot_time:
        raise HTTPException(status_code=400, detail="invalid slot")
    #update slot to available
    supabase.table("slots") \
    .update({details.slot: True}) \
    .eq("counsellor_id", details.counsellor_id) \
    .eq("date", details.appointment_date) \
    .eq("student_mail", details.student_mail) \
    .execute()
    #delete appointment
    try:
        supabase.table("appointments") \
        .delete() \
        .eq("counsellor_id", details.counsellor_id) \
        .eq("appointment_date", details.appointment_date) \
        .eq("appointment_time", slot_time) \
        .eq("student_mail", details.student_mail) \
        .execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail="failed to cancel appointment")
    return JSONResponse(content={"detail":"appointment cancelled successfully"}, status_code=200)