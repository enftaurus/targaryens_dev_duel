# Student Sanctuary – Local Development Guide

Welcome to **Student Sanctuary**. This repository contains the source code for a mental health support platform built with a **Python (FastAPI) backend** and a **Node.js (React + Vite) frontend**.

Since the frontend and backend run independently, you will need to keep **two separate terminals open** while running the application locally.

**Note:** For a visual walkthrough, please refer to the demo video provided with the submission.

---
## Tech Stack

Student Sanctuary is built using a modern, reliable tech stack focused on simplicity, scalability, and real-world feasibility.

### Backend

- **Python** – Core backend language used for logic and API development

- **FastAPI** – Backend framework used to build REST APIs with high performance and clear structure

- **Uvicorn** – ASGI server used to run the FastAPI application

- **Supabase (PostgreSQL)** – Database used for storing student data, appointments, and counsellor notes

- **SQL** – Used for structured data storage and querying

- **Python Dotenv** – For managing environment variables securely

### Frontend

- **React** – Used to build a responsive and component-based user interface

- **Vite** – Frontend build tool used for fast development and optimized builds

- **JavaScript (ES6+)** – Core frontend scripting language

- **HTML & CSS** – For layout, styling, and responsive design

### Authentication & Access Control

- **Role-based access control** – Separate access flows for students and counsellors

- **Session-based authentication** – Ensures secure user access within the application

### APIs & Integrations

- **Gemini API** – Used for the in-app FAQ and application assistance chatbot

  - The chatbot supports navigation and usage queries only

  - It does not provide medical or mental health advice

### Development & Tooling

- **Git & GitHub** – Version control and collaboration

- **npm** – Dependency management for frontend

- **pip** – Dependency management for backend

- **Virtual Environments (venv)** – Isolated Python environment for backend dependencies

### Design Principles

- No AI/ML used for assessments or decision-making

- Rule-based logic for screening and scoring

- Privacy-first system design

- Real-world feasibility over experimental features


## Prerequisites

Before you begin, ensure your system meets the following requirements:

- Python version 3.10 or higher  
- Node.js version 18 or higher  
- npm version 9 or higher  

Verify your installed versions using the following commands:


python --version

pip --version

node --version

npm --version

Installation and Setup

1. Clone the Repository

Start by cloning the project to your local machine:

git clone https://github.com/enftaurus/targaryens_dev_duel.git

cd targaryens_dev_duel

Backend Setup (Terminal 1)

Open your first terminal window and navigate to the backend directory.

cd backend

Configure Environment Variables

A pre-configured .env file is provided through a Google Drive link to simplify database setup.

Steps:

Download the .env file from the provided drive link.

Replace the existing .env.example file in the backend folder.

Rename the file to exactly .env.

Install Dependencies and Run the Backend

pip install -r requirements.txt

uvicorn server:app --reload

Important:
The backend must run on port 8000 (http://localhost:8000).
Running it on any other port will cause CORS issues and prevent the frontend from connecting.

Frontend Setup (Terminal 2)
Open a new and separate terminal window (do not close the backend terminal) and navigate to the frontend directory.

cd frontend
Install Dependencies and Run the Frontend


npm install
npm run dev
Important:
The frontend must run on port 5173 (http://localhost:5173).
This port is hardcoded; using a different port will result in connection issues.

Counsellor Access Credentials
To test the counsellor dashboard features, use the following demo credentials:

Role	               Email	                   Password

Counsellor (Akash)	akashreddy0314@gmail.com	dracarys

Usage Guide
Student Workflow
To test the student features, follow these steps:

Register and Login
Create a new student account and log in.

Self-Check
Complete the screening questionnaire to assess mental well-being.

Book an Appointment

Navigate to the appointment booking section.

Select Counsellor Akash (this ensures the appointment appears in the demo counsellor account).

Select the current date only.

Explore Resources
Use the FAQ chatbot, watch wellness videos, and read blogs.

Logout
Log out to switch to the counsellor view.

Counsellor Dashboard Workflow
To test counsellor functionality:

Login
Use the counsellor credentials provided above.
email akashreddy0314@gmail.com
password dracarys

View Appointments

Only appointments scheduled for the current date will appear.

Click an appointment to view the student’s profile and self-assessment summary.

Session Notes

Add notes after the session to track the student’s progress.

Notes are stored securely for continuity across future sessions.

Important System Logic
Please keep the following constraints in mind while testing:

Same-Day Visibility
A student’s full profile is visible to the counsellor only on the day of the scheduled appointment.
Future appointments will not appear until their scheduled date.

One Active Appointment
Each student can have only one active appointment at a time.

Data Access Control
Counsellor notes are accessible only to the counsellor who has an active appointment with that student.
