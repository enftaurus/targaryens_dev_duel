import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

load_dotenv()

msg = MIMEText("Test email")
msg["Subject"] = "SMTP Test"
msg["From"] = os.getenv("MAIL_FROM")
msg["To"] = os.getenv("MAIL_FROM")

server = smtplib.SMTP(os.getenv("MAIL_SERVER"), int(os.getenv("MAIL_PORT")))
server.starttls()
server.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
server.send_message(msg)
server.quit()

print("MAIL SENT")
