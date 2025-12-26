from fastapi import APIRouter,Request, HTTPException, status,Response
from models.forgot_pw import forgot_pw,reset_pw,validate_otp
from database import supabase
import random
import bcrypt
import time
import os
import smtplib
from email.mime.text import MIMEText
router = APIRouter(prefix="/forgot-password", tags=["forgot_password"])
#helper to send emails
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
def send_email(to_email: str, subject: str, body: str):
    """Send an email using SMTP."""
    msg = MIMEText(body, "plain")
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM
    msg["To"] = to_email

    try:
        with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
            server.starttls()
            server.login(MAIL_USERNAME, MAIL_PASSWORD)
            server.send_message(msg)
        print(f"✅ Email sent successfully to {to_email}")
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send OTP email. Please try again later."
        )
@router.post("/request-otp")
def request_otp(data: reset_pw):
    z=supabase.table("basic_details").select("*").eq("mail",data.mail).execute()
    if not z.data:
        raise HTTPException(status_code=404,detail="user does not exist try register")
    otp=random.randint(100000,999999)
    try:
        supabase.table("otp_table").upsert({"email":data.mail,"otp":otp,}).execute()
    except Exception as e:
        print(f"❌ Error inserting OTP data: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to store OTP. Please try again later."
        )
    send_email(
        to_email=data.mail,
        subject="Your OTP for Password Reset",
        body=f"Your OTP for password reset is: {otp}"
    )
    return {"detail":"OTP sent successfully to your email."}
@router.post("/update_password")
def validate_otp(data: validate_otp):
    z=supabase.table("otp_table").select("*").eq("email",data.mail).execute()
    if not z.data:
        raise HTTPException(status_code=404,detail="no otp requested for this mail")
    stored_otp=z.data[0]["otp"]
    if stored_otp != data.otp:
        raise HTTPException(status_code=400,detail="invalid otp")
    supabase.table("otp_table").delete().eq("email",data.mail).execute()
    return {"detail":"OTP validated successfully. You can now reset your password."}
@router.post("/reset-password")
@router.post("/reset-password")
def update_password(data: forgot_pw):
    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="passwords do not match")

    hashed_pw = bcrypt.hashpw(
        data.new_password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    try:
        supabase.table("basic_details") \
            .update({"password": hashed_pw}) \
            .eq("mail", data.mail) \
            .execute()
    except Exception as e:
        print(f"❌ Error updating password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password. Please try again later."
        )

    return {"detail": "Password updated successfully"}
