# Student Sanctuary – Local Development Setup

This repository contains a Python (FastAPI) backend and a Node.js (React + Vite) frontend.  
Both services must be run locally in **separate terminals**.

REFER THE DEMO VIDEO FOR SETUP GUIDE 
AS
MAKE SURE TO REPLACE THE .env.example inside backend and change name to .env

## Prerequisites

Ensure the following are installed on your system:

- Python 3.10 or higher
- Node.js 18 or higher
- npm 9 or higher

Verify installations:

python --version
pip --version
node --version
npm --version'

 CLONE THE REPOSITORY
git clone https://github.com/enftaurus/targaryens_dev_duel.git
cd targaryens_dev_duel

BACKEND SETUP
cd backend
NOW REPLACE THE .env.example with .env from drive link and change the name to .env ensure the name is .env
pip install -r requirements.txt
uvicorn server:app --reload
backend will start running on http://localhost:8000
MAKE SURE IT RUNS ON PORT 8000 AS IT IS CONFIGURED FOR 8000 ONLY RUNNING ON OTHER PORT WILL BRING CORS ISSUE 

FRONTEND SETUP ==>> ENSURE THAT BOTH BACKEND AND FRONTEND ARE NOT ON THE SAME TERMINAL USE DIFFERENT FOR FRONTEND 
cd frontend
npm install 
npm run dev 
frontend will start running on http://localhost:5173
MAKE SURE FRONTEND RUNS ON PORT 5173 AS IT IS CONFIGURED FOR 5173 ONLY , RUNNING ON OTHER PORT WILL BRING CORS ISSUE 

 COUNSELLOR DASHBOARD LOGIN CREDENTIALS 
 email:akashreddy0314@gmail.com
 password:dracarys 

Usage Instructions
Student Flow
-Register in the application using the student registration form.
-Log in with the registered credentials.
-Complete a self-check by answering the available screening questionnaires.
-Book a counselling appointment only for the current date.
-The counsellor dashboard will show a student’s profile only if the student has an appointment scheduled for that same day.
-Appointments booked for other dates will not be visible to the counsellor on that day.
-While booking, select the counsellor Akash, as the counsellor login credentials provided below correspond to this account.
-Explore the FAQ chatbot to understand application features and workflows.
-Watch wellness videos and read blogs available on the platform.
-Log out after completing your activities.

Counsellor Dashboard Usage
Login Instructions
-Open the counsellor dashboard.
-Log in using the following credentials:
-Email: akashreddy0314@gmail.com  
-Password: dracarys
-Counsellor Actions
-After logging in, open the appointment that was booked by the student for the current date.
-View the student’s profile and self-assessment summary.
-Add session notes after the appointment.
-These notes represent the student’s mental health progress across counselling sessions.
-Notes are stored securely and help maintain continuity of care.

Important Notes
-A student profile is visible to the counsellor only on the day of the scheduled appointment.
-Each student can have only one active appointment at a time.
-Counsellor notes are accessible only to counsellors with an active appointment for that student.



