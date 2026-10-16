from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class Member(BaseModel):
    name: str
    email: EmailStr
    phone: str
    college: str
    department: str
    year: str
    is_leader: bool = False

class TeamRegistrationRequest(BaseModel):
    team_name: str
    domain: str
    members: List[Member]
    fee_type: str = "online"  # "online" (1000) or "spot" (1500)
    custom_fields: Optional[Dict[str, Any]] = None

class TeamRecord(BaseModel):
    team_id: str
    registration_id: str  # e.g., BTS26-0001
    event_id: str = "TECHSPIRIT-2026"
    team_name: str
    domain: str
    leader_name: str
    leader_email: str
    leader_phone: str
    college: str
    team_size: int
    members: List[Dict[str, Any]]
    registration_status: str = "PENDING_PAYMENT"  # PENDING_PAYMENT, CONFIRMED, REJECTED, CHECKED_IN
    payment_status: str = "UNPAID"  # UNPAID, PAID, FAILED, REFUNDED
    amount: int = 1000
    qr_token: str
    created_at: str
    checked_in: bool = False
    checkin_time: Optional[str] = None

class FormField(BaseModel):
    field_id: str
    label: str
    field_type: str  # text, email, phone, dropdown, radio, checkbox, date, url, file
    required: bool = False
    options: Optional[List[str]] = []
    placeholder: Optional[str] = ""
    order: int = 0

class DynamicFormConfig(BaseModel):
    event_id: str = "TECHSPIRIT-2026"
    title: str = "BITS TECHSPIRIT 2026 Registration"
    description: str = "Official National Level Hackathon Registration"
    fields: List[FormField] = []
    is_active: bool = True

class PaymentOrderRequest(BaseModel):
    team_id: str
    amount: int = 1000

class PaymentVerifyRequest(BaseModel):
    team_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    mock_mode: bool = False

class ProjectSubmissionRequest(BaseModel):
    team_id: str
    project_title: str
    project_description: str
    domain: str
    github_url: str
    ppt_url: Optional[str] = ""
    demo_video_url: Optional[str] = ""
    tech_stack: Optional[List[str]] = []

class ScoreRequest(BaseModel):
    submission_id: str
    judge_name: str
    judge_id: str
    innovation: int = Field(ge=0, le=25)       # max 25
    implementation: int = Field(ge=0, le=25)   # max 25
    impact: int = Field(ge=0, le=20)           # max 20
    design_ux: int = Field(ge=0, le=15)        # max 15
    presentation: int = Field(ge=0, le=15)     # max 15
    feedback: Optional[str] = ""

class CheckinRequest(BaseModel):
    qr_token: str
    scanned_by: str = "Staff Desk"

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str  # Google ID token

class UserInfo(BaseModel):
    user_id: str
    email: str
    name: str
    role: str  # super_admin, event_admin, finance_admin, volunteer, judge, participant
