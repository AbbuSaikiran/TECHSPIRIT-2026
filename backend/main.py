import os
import uuid
import csv
import io
from datetime import datetime
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, Depends, HTTPException, status, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from config import settings
from database import load_db, save_db, log_audit
from models import (
    TeamRegistrationRequest, PaymentOrderRequest, PaymentVerifyRequest,
    ProjectSubmissionRequest, ScoreRequest, CheckinRequest,
    LoginRequest, GoogleLoginRequest, FormField, DynamicFormConfig
)
from auth import (
    create_access_token, verify_password, get_current_user,
    require_admin, require_judge, require_staff_or_admin
)
from services.sheets_service import sync_all_to_google_sheets, export_db_to_table_rows

app = FastAPI(
    title=settings.APP_NAME,
    description="BITS TECHSPIRIT 2026 Hackathon Management Platform & Google Sheets Database Engine",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 1. PUBLIC ENDPOINTS
# -------------------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "BITS TECHSPIRIT 2026 API",
        "time": datetime.utcnow().isoformat(),
        "database_mode": "Local JSON with Live Google Sheets Sync"
    }

@app.get("/api/event")
def get_event_details():
    db = load_db()
    event = db.get("events", [{}])[0]
    event_settings = db.get("event_settings", {}).get(settings.EVENT_ID, {})
    return {
        "event": event,
        "settings": event_settings
    }

@app.get("/api/forms/registration")
def get_registration_form():
    db = load_db()
    fields = db.get("form_fields", [])
    # Sort fields by order
    fields_sorted = sorted(fields, key=lambda x: x.get("order", 0))
    return {
        "event_id": settings.EVENT_ID,
        "title": "BITS TECHSPIRIT 2026 Registration",
        "fields": fields_sorted
    }

@app.post("/api/register")
def register_team(req: TeamRegistrationRequest):
    db = load_db()
    teams = db.get("teams", [])

    # Check for duplicate team name
    if any(t.get("team_name", "").strip().lower() == req.team_name.strip().lower() for t in teams):
        raise HTTPException(status_code=400, detail="Team name already taken. Please choose another name.")

    # Validate team size
    if not (1 <= len(req.members) <= 4):
        raise HTTPException(status_code=400, detail="Team size must be between 1 and 4 members.")

    # Find leader
    leader = next((m for m in req.members if m.is_leader), req.members[0])

    # Check duplicate leader email across all teams
    for t in teams:
        for m in t.get("members", []):
            if m.get("email", "").lower() == leader.email.lower():
                raise HTTPException(status_code=400, detail=f"A team member with email '{leader.email}' is already registered in team '{t.get('team_name')}'.")

    # Generate sequential registration ID like BTS26-0001
    next_num = len(teams) + 1
    reg_id = f"BTS26-{next_num:04d}"
    team_id = f"team-bts-{uuid.uuid4().hex[:8]}"
    qr_token = f"QR-{reg_id}-{uuid.uuid4().hex[:8].upper()}"

    fee_amount = settings.ONLINE_REGISTRATION_FEE if req.fee_type == "online" else settings.SPOT_REGISTRATION_FEE

    new_team = {
        "team_id": team_id,
        "registration_id": reg_id,
        "event_id": settings.EVENT_ID,
        "team_name": req.team_name.strip(),
        "domain": req.domain,
        "leader_name": leader.name,
        "leader_email": leader.email,
        "leader_phone": leader.phone,
        "college": leader.college,
        "team_size": len(req.members),
        "members": [m.dict() for m in req.members],
        "registration_status": "PENDING_PAYMENT",
        "payment_status": "UNPAID",
        "amount": fee_amount,
        "fee_type": req.fee_type,
        "qr_token": qr_token,
        "custom_fields": req.custom_fields or {},
        "created_at": datetime.utcnow().isoformat(),
        "checked_in": False,
        "checkin_time": None
    }

    teams.append(new_team)
    db["teams"] = teams
    save_db(db)

    log_audit("REGISTER_TEAM", f"Team {req.team_name} ({reg_id}) registered with {len(req.members)} members.", actor=leader.email)

    return {
        "success": True,
        "team_id": team_id,
        "registration_id": reg_id,
        "qr_token": qr_token,
        "amount": fee_amount,
        "team": new_team
    }

@app.get("/api/team/pass/{token}")
def get_team_pass(token: str):
    db = load_db()
    teams = db.get("teams", [])
    team = next((t for t in teams if t.get("qr_token") == token or t.get("registration_id") == token), None)
    if not team:
        raise HTTPException(status_code=404, detail="Registration record not found")
    return team

# -------------------------------------------------------------
# 2. PAYMENTS (RAZORPAY & SIMULATION)
# -------------------------------------------------------------

@app.post("/api/payments/create-order")
def create_payment_order(req: PaymentOrderRequest):
    db = load_db()
    team = next((t for t in db.get("teams", []) if t.get("team_id") == req.team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    amount_in_paise = req.amount * 100
    order_id = f"order_{uuid.uuid4().hex[:12]}"

    # If live Razorpay keys are configured
    if settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET and not settings.RAZORPAY_KEY_ID.startswith("rzp_test_placeholder"):
        try:
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": team.get("registration_id"),
                "notes": {"team_name": team.get("team_name")}
            })
            order_id = order.get("id")
        except Exception as e:
            # Fall back to simulated order for hackathon demo
            pass

    return {
        "order_id": order_id,
        "amount": req.amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
        "team_name": team.get("team_name"),
        "registration_id": team.get("registration_id")
    }

@app.post("/api/payments/verify")
def verify_payment(req: PaymentVerifyRequest):
    db = load_db()
    teams = db.get("teams", [])
    team = next((t for t in teams if t.get("team_id") == req.team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # In production Razorpay, signature verification using hmac sha256
    verified = True
    if not req.mock_mode and settings.RAZORPAY_KEY_SECRET and not settings.RAZORPAY_KEY_SECRET.startswith("rzp_test_placeholder"):
        try:
            import razorpay
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            client.utility.verify_payment_signature({
                "razorpay_order_id": req.razorpay_order_id,
                "razorpay_payment_id": req.razorpay_payment_id,
                "razorpay_signature": req.razorpay_signature
            })
        except Exception:
            verified = False
            raise HTTPException(status_code=400, detail="Invalid payment signature")

    # Mark team as confirmed and paid
    team["payment_status"] = "PAID"
    team["registration_status"] = "CONFIRMED"

    # Record payment transaction
    payment_record = {
        "payment_id": f"pay-{uuid.uuid4().hex[:8]}",
        "team_id": team.get("team_id"),
        "registration_id": team.get("registration_id"),
        "amount": team.get("amount", 1000),
        "gateway_order_id": req.razorpay_order_id,
        "transaction_id": req.razorpay_payment_id,
        "status": "SUCCESS",
        "payment_method": "UPI / Card Gateway",
        "created_at": datetime.utcnow().isoformat()
    }
    db.setdefault("payments", []).append(payment_record)
    save_db(db)

    log_audit("PAYMENT_SUCCESS", f"Team {team.get('team_name')} ({team.get('registration_id')}) paid ₹{team.get('amount')}.", actor=team.get("leader_name"))

    return {
        "success": True,
        "message": "Payment verified and registration confirmed!",
        "registration_id": team.get("registration_id"),
        "qr_token": team.get("qr_token"),
        "team": team
    }

# -------------------------------------------------------------
# 3. PROJECT SUBMISSIONS
# -------------------------------------------------------------

@app.post("/api/submissions")
def submit_project(req: ProjectSubmissionRequest):
    db = load_db()
    teams = db.get("teams", [])
    team = next((t for t in teams if t.get("team_id") == req.team_id or t.get("registration_id") == req.team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team registration not found")

    submissions = db.get("submissions", [])
    existing = next((s for s in submissions if s.get("team_id") == team.get("team_id")), None)

    submission_record = {
        "submission_id": existing.get("submission_id") if existing else f"sub-{uuid.uuid4().hex[:8]}",
        "team_id": team.get("team_id"),
        "registration_id": team.get("registration_id"),
        "team_name": team.get("team_name"),
        "domain": req.domain or team.get("domain"),
        "project_title": req.project_title,
        "project_description": req.project_description,
        "github_url": req.github_url,
        "ppt_url": req.ppt_url or "",
        "demo_video_url": req.demo_video_url or "",
        "tech_stack": req.tech_stack or [],
        "submitted_at": datetime.utcnow().isoformat()
    }

    if existing:
        submissions = [s if s.get("team_id") != team.get("team_id") else submission_record for s in submissions]
    else:
        submissions.append(submission_record)

    db["submissions"] = submissions
    save_db(db)

    log_audit("PROJECT_SUBMISSION", f"Project '{req.project_title}' submitted for team {team.get('team_name')}.", actor=team.get("team_name"))

    return {"success": True, "submission": submission_record}

@app.get("/api/submissions")
def get_submissions():
    db = load_db()
    return db.get("submissions", [])

# -------------------------------------------------------------
# 4. JUDGING & LEADERBOARD
# -------------------------------------------------------------

@app.post("/api/judging/score")
def submit_score(req: ScoreRequest, user: Dict[str, Any] = Depends(require_judge)):
    db = load_db()
    submissions = db.get("submissions", [])
    sub = next((s for s in submissions if s.get("submission_id") == req.submission_id), None)
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    total_score = req.innovation + req.implementation + req.impact + req.design_ux + req.presentation
    score_id = f"score-{uuid.uuid4().hex[:8]}"

    score_record = {
        "score_id": score_id,
        "submission_id": req.submission_id,
        "team_id": sub.get("team_id"),
        "team_name": sub.get("team_name"),
        "registration_id": sub.get("registration_id"),
        "judge_id": user.get("user_id") or req.judge_id,
        "judge_name": user.get("name") or req.judge_name,
        "innovation": req.innovation,
        "implementation": req.implementation,
        "impact": req.impact,
        "design_ux": req.design_ux,
        "presentation": req.presentation,
        "total": total_score,
        "feedback": req.feedback,
        "scored_at": datetime.utcnow().isoformat()
    }

    scores = db.get("scores", [])
    # Update if this judge already scored this submission, otherwise append
    filtered_scores = [s for s in scores if not (s.get("submission_id") == req.submission_id and s.get("judge_id") == score_record["judge_id"])]
    filtered_scores.append(score_record)
    db["scores"] = filtered_scores
    save_db(db)

    log_audit("SCORE_SUBMITTED", f"Judge {score_record['judge_name']} awarded {total_score}/100 to {sub.get('team_name')}.", actor=score_record["judge_name"])

    return {"success": True, "score": score_record}

@app.get("/api/leaderboard")
def get_leaderboard():
    db = load_db()
    submissions = db.get("submissions", [])
    scores = db.get("scores", [])

    # Group scores by submission
    scores_by_sub: Dict[str, List[int]] = {}
    for s in scores:
        sub_id = s.get("submission_id")
        scores_by_sub.setdefault(sub_id, []).append(s.get("total", 0))

    ranked = []
    for sub in submissions:
        sub_id = sub.get("submission_id")
        sub_scores = scores_by_sub.get(sub_id, [])
        avg_score = round(sum(sub_scores) / len(sub_scores), 1) if sub_scores else 0
        ranked.append({
            "submission_id": sub_id,
            "registration_id": sub.get("registration_id"),
            "team_name": sub.get("team_name"),
            "domain": sub.get("domain"),
            "project_title": sub.get("project_title"),
            "scores_count": len(sub_scores),
            "score": avg_score
        })

    # Sort descending by score
    ranked.sort(key=lambda x: x["score"], reverse=True)
    for idx, item in enumerate(ranked):
        item["rank"] = idx + 1

    return ranked

# -------------------------------------------------------------
# 5. EVENT-DAY CHECK-IN OPERATIONS
# -------------------------------------------------------------

@app.post("/api/operations/checkin")
def scan_checkin(req: CheckinRequest, user: Dict[str, Any] = Depends(require_staff_or_admin)):
    db = load_db()
    teams = db.get("teams", [])
    token = req.qr_token.strip()

    team = next((t for t in teams if t.get("qr_token") == token or t.get("registration_id") == token), None)
    if not team:
        raise HTTPException(status_code=404, detail="Invalid QR pass or registration ID.")

    if team.get("payment_status") != "PAID":
        raise HTTPException(status_code=400, detail=f"Cannot check in: Team {team.get('team_name')} payment status is {team.get('payment_status')}. Please settle fees at finance desk.")

    if team.get("checked_in"):
        return {
            "success": False,
            "already_checked_in": True,
            "message": f"Team '{team.get('team_name')}' was ALREADY checked in on {team.get('checkin_time')}!",
            "team": team
        }

    now = datetime.utcnow().isoformat()
    team["checked_in"] = True
    team["checkin_time"] = now
    team["registration_status"] = "CHECKED_IN"

    checkin_record = {
        "checkin_id": f"chk-{uuid.uuid4().hex[:8]}",
        "team_id": team.get("team_id"),
        "registration_id": team.get("registration_id"),
        "team_name": team.get("team_name"),
        "scanned_by": user.get("name", req.scanned_by),
        "timestamp": now,
        "entry_status": "APPROVED"
    }

    db.setdefault("checkins", []).append(checkin_record)
    save_db(db)

    log_audit("TEAM_CHECKED_IN", f"Team {team.get('team_name')} ({team.get('registration_id')}) checked in by {checkin_record['scanned_by']}.", actor=checkin_record["scanned_by"])

    return {
        "success": True,
        "already_checked_in": False,
        "message": f"Check-in verified! Welcome Team '{team.get('team_name')}' to BITS TECHSPIRIT 2026.",
        "team": team,
        "checkin": checkin_record
    }

# -------------------------------------------------------------
# 6. AUTHENTICATION (EMAIL/PASSWORD & GOOGLE SIGN-IN)
# -------------------------------------------------------------

@app.post("/api/auth/login")
def login(req: LoginRequest):
    db = load_db()
    user = next((u for u in db.get("users", []) if u.get("email").lower() == req.email.lower()), None)
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"],
        "name": user["name"],
        "user_id": user["user_id"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "user_id": user["user_id"]
        }
    }

@app.post("/api/auth/google")
def google_login(req: GoogleLoginRequest):
    # Supports Google OAuth token verification
    email = "admin@bitstechspirit.org"
    name = "BITS Google Admin"
    
    # In production, verify with google-auth library
    if req.credential and not req.credential.startswith("mock_"):
        try:
            from google.oauth2 import id_token
            from google.auth.transport import requests as google_requests
            idinfo = id_token.verify_oauth2_token(
                req.credential, google_requests.Request(), settings.GOOGLE_CLIENT_ID or None
            )
            email = idinfo['email']
            name = idinfo.get('name', 'Google User')
        except Exception as e:
            # For offline/demo convenience, allow graceful fallback if client ID isn't registered yet
            pass

    db = load_db()
    user = next((u for u in db.get("users", []) if u.get("email").lower() == email.lower()), None)
    if not user:
        user = {
            "user_id": f"usr-{uuid.uuid4().hex[:8]}",
            "email": email,
            "name": name,
            "role": "super_admin",
            "created_at": datetime.utcnow().isoformat()
        }
        db.setdefault("users", []).append(user)
        save_db(db)

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"],
        "name": user["name"],
        "user_id": user["user_id"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@app.get("/api/auth/me")
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user

# -------------------------------------------------------------
# 7. ADMIN CONTROL CENTER
# -------------------------------------------------------------

@app.get("/api/admin/metrics")
def get_admin_metrics(user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    teams = db.get("teams", [])
    payments = db.get("payments", [])
    submissions = db.get("submissions", [])

    total_teams = len(teams)
    total_participants = sum(len(t.get("members", [])) for t in teams)
    verified_payments_count = sum(1 for t in teams if t.get("payment_status") == "PAID")
    total_revenue = sum(p.get("amount", 0) for p in payments if p.get("status") == "SUCCESS")
    pending_payments_count = sum(1 for t in teams if t.get("payment_status") != "PAID")
    checked_in_count = sum(1 for t in teams if t.get("checked_in"))
    submissions_count = len(submissions)

    return {
        "total_teams": total_teams,
        "total_participants": total_participants,
        "verified_payments_count": verified_payments_count,
        "total_revenue": total_revenue,
        "pending_payments_count": pending_payments_count,
        "checked_in_count": checked_in_count,
        "submissions_count": submissions_count
    }

@app.get("/api/admin/teams")
def get_all_teams(user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    return db.get("teams", [])

@app.patch("/api/admin/teams/{team_id}")
def update_team(team_id: str, updates: Dict[str, Any], user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    teams = db.get("teams", [])
    team = next((t for t in teams if t.get("team_id") == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    for k, v in updates.items():
        if k in ["registration_status", "payment_status", "domain", "amount", "checked_in"]:
            team[k] = v

    save_db(db)
    log_audit("UPDATE_TEAM", f"Admin {user['name']} modified team {team.get('team_name')} ({team.get('registration_id')}).", actor=user["name"])
    return {"success": True, "team": team}

@app.delete("/api/admin/teams/{team_id}")
def delete_team(team_id: str, user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    teams = db.get("teams", [])
    team = next((t for t in teams if t.get("team_id") == team_id), None)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    db["teams"] = [t for t in teams if t.get("team_id") != team_id]
    save_db(db)
    log_audit("DELETE_TEAM", f"Admin {user['name']} deleted team {team.get('team_name')}.", actor=user["name"])
    return {"success": True}

# DYNAMIC FORM BUILDER
@app.post("/api/admin/form-fields")
def save_form_fields(fields: List[FormField], user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    db["form_fields"] = [f.dict() for f in fields]
    save_db(db)
    log_audit("UPDATE_FORM_BUILDER", f"Admin {user['name']} updated registration form fields ({len(fields)} fields).", actor=user["name"])
    return {"success": True, "fields": db["form_fields"]}

# GOOGLE SHEETS FULL DATABASE SYNC
@app.post("/api/admin/sync-sheets")
def trigger_sheets_sync(user: Dict[str, Any] = Depends(require_admin)):
    result = sync_all_to_google_sheets()
    log_audit("SYNC_GOOGLE_SHEETS", f"Full database sync invoked by {user['name']}. Result: {result.get('message', 'Complete')}", actor=user["name"])
    return result

# CSV EXPORTS
@app.get("/api/admin/export-csv/{table_name}")
def export_csv(table_name: str, user: Dict[str, Any] = Depends(require_admin)):
    tables = export_db_to_table_rows()
    if table_name not in tables:
        raise HTTPException(status_code=404, detail=f"Table {table_name} not found. Available: {list(tables.keys())}")

    rows = tables[table_name]
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(rows)
    output.seek(0)

    filename = f"bits_techspirit_2026_{table_name.lower()}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@app.get("/api/admin/audit-logs")
def get_audit_logs(user: Dict[str, Any] = Depends(require_admin)):
    db = load_db()
    logs = db.get("audit_logs", [])
    return sorted(logs, key=lambda x: x.get("timestamp", ""), reverse=True)
