from fastapi import APIRouter, HTTPException, Request
from models.appointments import basic
from database import supabase

from datetime import date, time
import re
import os
import smtplib
from email.mime.text import MIMEText

router = APIRouter(prefix="/appointments", tags=["appointments"])

# ------------------ MAIL CONFIG ------------------
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")


# ------------------ UTILITIES ------------------

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body, "plain")
    msg["Subject"] = subject
    msg["From"] = MAIL_FROM
    msg["To"] = to_email

    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT, timeout=10) as server:
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.send_message(msg)


def normalize_indian_mobile(mobile: str) -> str:
    digits = re.sub(r"\D", "", mobile)
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    if len(digits) != 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number")
    return digits


def get_time(slot: str) -> str:
    slots = {
        "slot1": time(9, 0),
        "slot2": time(11, 0),
        "slot3": time(13, 0),
        "slot4": time(15, 0),
        "slot5": time(17, 0),
    }
    return slots[slot].strftime("%H:%M:%S")


# ------------------ COUNSELLORS ------------------

@router.get("/counsellors")
def get_counsellors():
    try:
        res = supabase.table("counsellor_details").select("*").execute()
        for counsellor in res.data or []:
            counsellor["id"] = str(counsellor["id"])
            counsellor.pop("password", None)
        return {"counsellors": res.data or []}
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to fetch counsellors")


# ------------------ SLOTS ------------------

@router.get("/slots/{counsellor_id}/{date}")
def display_slots(counsellor_id: str, date: date):
    date_val = str(date)

    res = (
        supabase.table("slots")
        .select("*")
        .eq("counsellor_id", counsellor_id)
        .eq("date", date_val)
        .execute()
    )

    if not res.data:
        supabase.table("slots").insert({
            "counsellor_id": counsellor_id,
            "date": date_val,
            "slot1": True,
            "slot2": True,
            "slot3": True,
            "slot4": True,
            "slot5": True,
        }).execute()

        res = (
            supabase.table("slots")
            .select("*")
            .eq("counsellor_id", counsellor_id)
            .eq("date", date_val)
            .execute()
        )

    row = res.data[0]

    return {
        "counsellor_id": counsellor_id,
        "date": date_val,
        "available_slots": {
            "slot1": row["slot1"],
            "slot2": row["slot2"],
            "slot3": row["slot3"],
            "slot4": row["slot4"],
            "slot5": row["slot5"],
        },
    }


# ------------------ BOOK APPOINTMENT ------------------

@router.post("/book")
def book(details: basic, request: Request):
    student_email = request.cookies.get("user_mail")
    if not student_email:
        raise HTTPException(status_code=401, detail="Login required")

    # ------------------ CHECK EXISTING APPOINTMENT ------------------

    existing = (
        supabase.table("appointments")
        .select("id")
        .eq("student_mail", student_email)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=409,
            detail="You already have an active appointment"
        )

    slot = details.slot
    date_val = str(details.date)

    # ------------------ CHECK SLOT AVAILABILITY ------------------

    slot_row = (
        supabase.table("slots")
        .select("*")
        .eq("counsellor_id", details.counsellor_id)
        .eq("date", date_val)
        .execute()
    )

    if not slot_row.data or not slot_row.data[0].get(slot):
        raise HTTPException(status_code=409, detail="Slot unavailable")

    appointment = {
        "student_name": details.name,
        "student_mail": student_email,
        "student_mobile": normalize_indian_mobile(details.phone),
        "counsellor_name": details.counsellor_name,
        "counsellor_mail": details.counsellor_mail,
        "counsellor_id": details.counsellor_id,
        "appointment_date": date_val,
        "appointment_time": get_time(slot),
        "consent": details.consent,
    }

    # ==================================================
    # 1️⃣ CRITICAL SECTION: DATABASE OPERATIONS
    # ==================================================

    try:
        print("📌 Reserving slot in DB")

        supabase.table("slots").update(
            {slot: False}
        ).eq(
            "counsellor_id", details.counsellor_id
        ).eq(
            "date", date_val
        ).execute()

        print("📌 Inserting appointment in DB")

        supabase.table("appointments").insert(appointment).execute()

        print("✅ Appointment successfully saved in DB")

    except Exception as e:
        print("❌ DB ERROR during booking")
        print(e)

        # Rollback slot
        try:
            supabase.table("slots").update(
                {slot: True}
            ).eq(
                "counsellor_id", details.counsellor_id
            ).eq(
                "date", date_val
            ).execute()
            print("↩️ Slot rollback successful")
        except Exception as rollback_error:
            print("❌ Slot rollback failed")
            print(rollback_error)

        raise HTTPException(
            status_code=500,
            detail="Failed to book appointment"
        )

    # ==================================================
    # 2️⃣ NON-CRITICAL SECTION: EMAIL SENDING
    # ==================================================

    try:
        print("📧 Sending email to counsellor")

        send_email(
            details.counsellor_mail,
            "New Appointment Booked",
            f"""
Hello {details.counsellor_name},

You have a new appointment.

Student: {details.name}
Email: {student_email}
Date: {date_val}
Time: {get_time(slot)}

Regards,
Student Sanctuary
"""
        )

        print("📧 Sending confirmation email to student")

        send_email(
            student_email,
            "Appointment Confirmed",
            f"""
Hello {details.name},

Your appointment has been successfully booked.

Counsellor: {details.counsellor_name}
Date: {date_val}
Time: {get_time(slot)}

Regards,
Student Sanctuary
"""
        )

        print("✅ Emails sent successfully")

    except Exception as e:
        # DO NOT rollback booking
        print("⚠️ EMAIL ERROR (booking kept)")
        print(e)

    # ==================================================
    # FINAL RESPONSE
    # ==================================================

    return {
        "message": "Appointment booked successfully",
        "date": date_val,
        "slot": slot,
        "counsellor_id": details.counsellor_id,
    }
