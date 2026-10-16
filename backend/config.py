import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "BITS TECHSPIRIT 2026 Hackathon API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bits_techspirit_super_secret_jwt_key_2026_secured")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Google Sheets Integration
    # Can use either Google Service Account JSON file OR Google Apps Script Webhook URL
    GOOGLE_SHEETS_SPREADSHEET_ID: str = os.getenv("GOOGLE_SHEETS_SPREADSHEET_ID", "")
    GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "credentials.json")
    GOOGLE_APPS_SCRIPT_URL: str = os.getenv("GOOGLE_APPS_SCRIPT_URL", "")

    # Razorpay Integration
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder_key")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "rzp_test_placeholder_secret")

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Hackathon Configuration
    EVENT_ID: str = "TECHSPIRIT-2026"
    ONLINE_REGISTRATION_FEE: int = 1000  # INR
    SPOT_REGISTRATION_FEE: int = 1500    # INR

    class Config:
        env_file = ".env"

settings = Settings()
