const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'hackathon_db.json');

function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      events: [
        {
          event_id: "TECHSPIRIT-2026",
          name: "BITS TECHSPIRIT 2026",
          slug: "techspirit-2026",
          tagline: "National Level Hackathon | Code the Future",
          start_date: "2026-10-26T09:00:00",
          end_date: "2026-10-27T18:00:00",
          venue: "BITS Campus Auditorium & Tech Hub",
          status: "PUBLISHED",
          prize_pool: "₹1,50,000",
          domains: [
            "Cybersecurity & Privacy",
            "Artificial Intelligence & ML",
            "Smart Mobility & EV Tech",
            "Healthcare & Biomedical",
            "IoT & Smart Infrastructure",
            "Blockchain & Web3",
            "AgriTech & Sustainability",
            "FinTech & Decentralized Economy",
            "AR/VR & Immersive Computing",
            "Open Innovation"
          ]
        }
      ],
      event_settings: {
        "TECHSPIRIT-2026": {
          online_fee: 1000,
          spot_fee: 1500,
          team_min: 1,
          team_max: 4,
          deadline: "2026-10-24T23:59:59",
          registration_open: true,
          allow_spot_registration: true
        }
      },
      users: [
        {
          user_id: "usr-admin-01",
          email: "admin@bitstechspirit.org",
          name: "BITS Super Admin",
          role: "super_admin",
          password_hash: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WVRMQM5o2F0vK", // Admin@2026
          created_at: "2026-10-01T00:00:00"
        },
        {
          user_id: "usr-judge-01",
          email: "judge@bitstechspirit.org",
          name: "Dr. Sarah Chen (Chief Judge)",
          role: "judge",
          password_hash: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WVRMQM5o2F0vK",
          created_at: "2026-10-01T00:00:00"
        },
        {
          user_id: "usr-desk-01",
          email: "desk@bitstechspirit.org",
          name: "Check-in Desk Staff",
          role: "volunteer",
          password_hash: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6W65WVRMQM5o2F0vK",
          created_at: "2026-10-01T00:00:00"
        }
      ],
      form_fields: [
        { field_id: "team_name", label: "Team Name", field_type: "text", required: true, options: [], order: 1 },
        { field_id: "domain", label: "Problem Track / Domain", field_type: "dropdown", required: true, options: [
          "Cybersecurity & Privacy", "Artificial Intelligence & ML", "Smart Mobility & EV Tech",
          "Healthcare & Biomedical", "IoT & Smart Infrastructure", "Blockchain & Web3",
          "AgriTech & Sustainability", "FinTech & Decentralized Economy", "AR/VR & Immersive Computing", "Open Innovation"
        ], order: 2 },
        { field_id: "project_idea_summary", label: "Project Idea Summary (Brief)", field_type: "text", required: false, options: [], order: 3 },
        { field_id: "accommodation_needed", label: "Do you need hostel accommodation?", field_type: "dropdown", required: true, options: ["No", "Yes (Subject to availability)"], order: 4 }
      ],
      teams: [
        {
          team_id: "team-bts-0001",
          registration_id: "BTS26-0001",
          event_id: "TECHSPIRIT-2026",
          team_name: "QuantumSentinels",
          domain: "Cybersecurity & Privacy",
          leader_name: "Arjun Sharma",
          leader_email: "arjun.sharma@example.com",
          leader_phone: "+91 9876543210",
          college: "BITS Pilani",
          team_size: 3,
          members: [
            { name: "Arjun Sharma", email: "arjun.sharma@example.com", phone: "+91 9876543210", college: "BITS Pilani", department: "CSE", year: "3rd Year", is_leader: true },
            { name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 9876543211", college: "BITS Pilani", department: "ECE", year: "3rd Year", is_leader: false },
            { name: "Rahul Verma", email: "rahul.v@example.com", phone: "+91 9876543212", college: "BITS Pilani", department: "CSE", year: "2nd Year", is_leader: false }
          ],
          registration_status: "CONFIRMED",
          payment_status: "PAID",
          amount: 1000,
          fee_type: "online",
          qr_token: "QR-BTS26-0001-SECURE-TOKEN-A98F",
          created_at: "2026-10-12T14:32:00",
          checked_in: true,
          checkin_time: "2026-10-14T10:15:20"
        },
        {
          team_id: "team-bts-0002",
          registration_id: "BTS26-0002",
          event_id: "TECHSPIRIT-2026",
          team_name: "NeuroVision AI",
          domain: "Artificial Intelligence & ML",
          leader_name: "Sneha Patel",
          leader_email: "sneha.ai@example.com",
          leader_phone: "+91 9123456780",
          college: "IIT Bombay",
          team_size: 2,
          members: [
            { name: "Sneha Patel", email: "sneha.ai@example.com", phone: "+91 9123456780", college: "IIT Bombay", department: "AI & Data Science", year: "4th Year", is_leader: true },
            { name: "Rohan Deshmukh", email: "rohan.d@example.com", phone: "+91 9123456781", college: "IIT Bombay", department: "CSE", year: "4th Year", is_leader: false }
          ],
          registration_status: "CONFIRMED",
          payment_status: "PAID",
          amount: 1000,
          fee_type: "online",
          qr_token: "QR-BTS26-0002-SECURE-TOKEN-B72C",
          created_at: "2026-10-13T09:12:00",
          checked_in: false,
          checkin_time: null
        }
      ],
      payments: [
        {
          payment_id: "pay_test_001",
          team_id: "team-bts-0001",
          registration_id: "BTS26-0001",
          amount: 1000,
          gateway_order_id: "order_bts_001",
          transaction_id: "pay_live_txn_9941a8",
          status: "SUCCESS",
          payment_method: "UPI / Card",
          created_at: "2026-10-12T14:35:10"
        },
        {
          payment_id: "pay_test_002",
          team_id: "team-bts-0002",
          registration_id: "BTS26-0002",
          amount: 1000,
          gateway_order_id: "order_bts_002",
          transaction_id: "pay_live_txn_8832c4",
          status: "SUCCESS",
          payment_method: "UPI / Netbanking",
          created_at: "2026-10-13T09:15:30"
        }
      ],
      submissions: [
        {
          submission_id: "sub-bts-0001",
          team_id: "team-bts-0001",
          registration_id: "BTS26-0001",
          team_name: "QuantumSentinels",
          domain: "Cybersecurity & Privacy",
          project_title: "SentinelGuard: Autonomous Zero-Trust API Firewall",
          project_description: "A real-time behavioral intrusion detection agent that intercepts malicious LLM prompt injections and DDoS micro-bursts before hitting internal microservices.",
          github_url: "https://github.com/example/sentinel-guard",
          ppt_url: "https://docs.google.com/presentation/d/example-bts26-sentinel",
          demo_video_url: "https://youtu.be/example-demo-01",
          tech_stack: ["Python", "FastAPI", "eBPF", "React", "Rust"],
          submitted_at: "2026-10-14T11:00:00"
        }
      ],
      scores: [
        {
          score_id: "score-001",
          submission_id: "sub-bts-0001",
          judge_id: "usr-judge-01",
          judge_name: "Dr. Sarah Chen",
          innovation: 24,
          implementation: 23,
          impact: 19,
          design_ux: 14,
          presentation: 14,
          total: 94,
          feedback: "Outstanding zero-trust architecture and impressive live demonstration.",
          scored_at: "2026-10-14T12:30:00"
        }
      ],
      checkins: [
        {
          checkin_id: "chk-001",
          team_id: "team-bts-0001",
          registration_id: "BTS26-0001",
          team_name: "QuantumSentinels",
          scanned_by: "Staff Desk 1",
          timestamp: "2026-10-14T10:15:20",
          entry_status: "APPROVED"
        }
      ],
      audit_logs: [
        {
          log_id: "log-001",
          actor: "System",
          action: "INIT_DATABASE",
          details: "Hackathon platform initialized for BITS TECHSPIRIT 2026",
          timestamp: "2026-10-14T00:00:00"
        }
      ]
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function loadDb() {
  initDb();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw);
}

function saveDb(data) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function logAudit(action, details, actor = "Admin") {
  const db = loadDb();
  const logEntry = {
    log_id: `log-${crypto.randomBytes(4).toString('hex')}`,
    actor,
    action,
    details,
    timestamp: new Date().toISOString()
  };
  if (!db.audit_logs) db.audit_logs = [];
  db.audit_logs.push(logEntry);
  saveDb(db);
  return logEntry;
}

module.exports = {
  loadDb,
  saveDb,
  logAudit,
  initDb
};
