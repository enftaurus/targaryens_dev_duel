from pydantic import BaseModel, EmailStr
from datetime import time
class cancel(BaseModel):
    student_mail:EmailStr
    counsellor_id:str
    appointment_date:str
    slot:str
