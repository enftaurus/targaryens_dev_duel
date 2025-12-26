from fastapi import APIRouter
from models.chat import ChatMessage
import os
import google.generativeai as genai
import traceback
import logging

router = APIRouter(prefix="/chat", tags=["chat"])

# ==================================================
# LOGGING SETUP
# ==================================================

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chat")


# ==================================================
# GEN AI CONFIG
# ==================================================

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

GENAI_ENABLED = False

if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        GENAI_ENABLED = True
        logger.info("✅ GenAI configured for chat")
    except Exception as e:
        logger.error("❌ Failed to configure GenAI", exc_info=e)
else:
    logger.warning("⚠️ GenAI NOT configured — using FAQ fallback only")


# ==================================================
# BROAD FAQ INTENTS
# ==================================================

FAQ_INTENTS = [
    {
        "intent": "booking_flow",
        "keywords": [
            "book", "booking", "appointment", "schedule", "slot",
            "time", "date", "available", "availability"
        ],
        "answer": (
            "You can book an appointment by selecting a counsellor, choosing an "
            "available date and time slot, and confirming your details."
        ),
    },
    {
        "intent": "session_details",
        "keywords": [
            "session", "meeting", "call", "link", "join",
            "email", "mail", "notification", "message"
        ],
        "answer": (
            "Session details such as date, time, and joining instructions "
            "are shared with you via your registered email after confirmation."
        ),
    },
    {
        "intent": "cancel_or_reschedule",
        "keywords": [
            "cancel", "delete", "remove", "drop",
            "reschedule", "change", "modify", "update", "postpone"
        ],
        "answer": (
            "You can cancel or reschedule your appointment from the "
            "Appointments section before the scheduled time."
        ),
    },
    {
        "intent": "multiple_appointments",
        "keywords": [
            "multiple", "another", "second", "again",
            "already", "active", "existing"
        ],
        "answer": (
            "Only one active appointment is allowed at a time. "
            "Please complete or cancel the existing appointment first."
        ),
    },
    {
        "intent": "login_or_access",
        "keywords": [
            "login", "sign in", "signin", "logout",
            "access", "account", "authentication", "cookie"
        ],
        "answer": (
            "Please ensure you are logged in to your account to access "
            "appointments and chat features."
        ),
    },
    {
        "intent": "self_check",
        "keywords": [
            "self check", "self-check", "survey", "test",
            "assessment", "phq", "gad", "score", "questionnaire"
        ],
        "answer": (
            "The self-check is a preliminary assessment based on standard "
            "questionnaires and is meant only for general awareness."
        ),
    },
    {
        "intent": "technical_issue",
        "keywords": [
            "error", "issue", "problem", "not working",
            "failed", "bug", "crash", "slow"
        ],
        "answer": (
            "If you are facing technical issues, please try refreshing the page "
            "or logging in again. If the problem persists, contact support."
        ),
    },
]

FALLBACK_MESSAGE = (
    "I can help you understand how the app works, booking appointments, "
    "and managing sessions."
)


# ==================================================
# FAQ MATCHER (BROAD)
# ==================================================

def match_faq(user_message: str) -> str | None:
    msg = user_message.lower()

    for faq in FAQ_INTENTS:
        if any(keyword in msg for keyword in faq["keywords"]):
            logger.info(f"📘 FAQ matched intent: {faq['intent']}")
            return faq["answer"]

    return None


# ==================================================
# GEN AI CALL
# ==================================================

def ask_google_genai(message: str) -> str:
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
You are a support chatbot for a mental health appointment booking app.

RULES:
- ONLY help with app navigation and features
- NEVER give mental health, medical, or emergency advice
- If user asks anything else, say you help only with app usage

APP FEATURES:
- Login & registration required
- Self-check is a preliminary PHQ/GAD questionnaire (not AI/ML, not diagnosis)
- Only ONE active appointment allowed at a time
- Appointments can be cancelled and rebooked to reschedule
- Session details and Google Meet link are sent via registered email
- Chat is for support & navigation only
- For well-being tips, guide users to app videos and blogs
- This app does NOT provide emergency assistance

User message:
{message}
"""

    response = model.generate_content(prompt)
    return response.text.strip()


# ==================================================
# CHAT ENDPOINT
# ==================================================

@router.post("/")
def chat_response(req: ChatMessage):
    user_message = req.message.strip()

    if not user_message:
        logger.info("⚠️ Empty message received")
        return {"reply": FALLBACK_MESSAGE}

    # ---------- 1️⃣ TRY GEN AI ----------
    if GENAI_ENABLED:
        try:
            logger.info("🤖 Sending message to GenAI")
            ai_reply = ask_google_genai(user_message)
            if ai_reply:
                logger.info("✅ GenAI response returned")
                return {"reply": ai_reply}
        except Exception:
            logger.error("❌ GenAI failed, falling back to FAQ")
            traceback.print_exc()

    # ---------- 2️⃣ FAQ FALLBACK ----------
    faq_answer = match_faq(user_message)
    if faq_answer:
        logger.info("↩️ Responding via FAQ fallback")
        return {"reply": faq_answer}

    # ---------- 3️⃣ FINAL SAFE RESPONSE ----------
    logger.info("🛟 Default fallback response used")
    return {"reply": FALLBACK_MESSAGE}
