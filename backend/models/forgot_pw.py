from pydantic import BaseModel, EmailStr
class forgot_pw(BaseModel):
    mail: EmailStr
    new_password: str
    confirm_password: str

class reset_pw(BaseModel):  
    mail: EmailStr
class validate_otp(BaseModel):
    mail: EmailStr
    otp: int