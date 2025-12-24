from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import config
from routes import predict
from routes import chatbot
from routes import register
from routes import login
from routes import logout
from routes import profile
from routes import session
from routes import counsellor_login
from routes import counsellor_logout
from routes import counsellor_profile
from routes import appointments
from routes import forgot_pw
from routes import cancel_appo
from routes import dashboard
from routes import counsellor_notes
from routes import con_stuinfo
from database import supabase

app = FastAPI(title="Student Sanctuary Backend", version="5.0")

# ✅ Step 1: Add CORS middleware BEFORE routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",  # ✅ Use your frontend dev server URL
        "http://localhost:5173",  # ✅ Optional, covers both
    ],
    allow_credentials=True,       # ✅ Required for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Step 2: Include routers
app.include_router(predict.router)
app.include_router(chatbot.router)
app.include_router(register.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(profile.router)
app.include_router(session.router)
app.include_router(counsellor_profile.router)
app.include_router(counsellor_login.router)
app.include_router(counsellor_logout.router)
app.include_router(appointments.router)
app.include_router(cancel_appo.router)
app.include_router(forgot_pw.router)
app.include_router(dashboard.router)
app.include_router(counsellor_notes.router)
app.include_router(con_stuinfo.router)
@app.get("/")
def root():
    return {"status": "ok", "message": "Student Sanctuary Backend Active 🚀"}
