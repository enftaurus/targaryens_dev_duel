from pydantic import BaseModel, EmailStr
class stukey(BaseModel):
    student_mail: EmailStr  
