from pydantic import BaseModel, EmailStr
class note_entry(BaseModel):
    counsellor_mail: EmailStr
    student_mail: EmailStr
    note: str
class GetNotes(BaseModel):
    counsellor_mail: EmailStr
    student_mail: EmailStr