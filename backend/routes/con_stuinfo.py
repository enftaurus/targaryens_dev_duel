from fastapi import APIRouter, HTTPException, status, Request
from database import supabase
from models.stu_info import stukey
router = APIRouter(prefix="/get_student_info", tags=["get student info"])
@router.post("/profile")
def get_student_info(request: Request, student: stukey):
    mail = request.cookies.get("user_mail")
    if not mail:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    try:
        result = supabase.table("basic_details").select("*").eq("mail", student.student_mail).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"No student found with mail: {student.student_mail}")
        profile = result.data[0]
        profile.pop("password", None)
        profile.pop("created_at", None)
        profile.pop("id", None)
        return {"details": profile}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student info: {str(e)}")
@router.post("/mental_health")
def get_student_mental_health(request: Request, student: stukey):
    mail = request.cookies.get("user_mail")
    if not mail:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not logged in")
    try:
        result = supabase.table("mental_health").select("*").eq("mail", student.student_mail).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"No mental health data found for mail: {student.student_mail}")
        mental_health_data = result.data[0]
        mental_health_data.pop("created_at", None)
        mental_health_data.pop("id", None)
        past_mental_health = supabase.table("arch_mental_health").select("*").eq("mail", student.student_mail).execute()
        past_data = past_mental_health.data[0] if past_mental_health.data else []
        return {"mental_health_data": mental_health_data, "past_mental_health": past_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching mental health data: {str(e)}")