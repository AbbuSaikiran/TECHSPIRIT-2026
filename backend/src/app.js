const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { z } = require('zod');
require('dotenv').config();

const { loadDb, saveDb, logAudit } = require('./database');
const {
  verifyPassword,
  createAccessToken,
  requireAuth,
  requireAdmin,
  requireJudge,
  requireStaffOrAdmin
} = require('./auth');
const {
  exportDbToTableRows,
  syncAllToGoogleSheets,
  appendRegistrationRow,
  SHEET_SCHEMAS
} = require('./services/sheets');

const app = express();

// Enable CORS for frontend development
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// 1. HEALTH & METADATA
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    message: 'TECHSPIRIT-2026 Node.js Express API is running',
    spreadsheet_id: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1Y8ExCm3-oXK10o7Wysml0ITGXsLfnqb5kV899ddMm5k',
    google_client_id: process.env.GOOGLE_CLIENT_ID || '429603335767-tfa0uohlkbp9hb3kcloh81f272jqiqf0.apps.googleusercontent.com',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/events', (req, res) => {
  const db = loadDb();
  res.json({
    success: true,
    events: db.events || [],
    settings: db.event_settings?.['TECHSPIRIT-2026'] || {}
  });
});

app.get('/api/event', (req, res) => {
  const db = loadDb();
  const event = (db.events && db.events[0]) || {};
  const settings = db.event_settings?.['TECHSPIRIT-2026'] || {};
  res.json({
    event,
    settings
  });
});

app.get('/api/forms/registration', (req, res) => {
  const db = loadDb();
  const fields = (db.form_fields || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  res.json({
    event_id: 'TECHSPIRIT-2026',
    title: 'BITS TECHSPIRIT 2026 Registration',
    fields
  });
});

// -------------------------------------------------------------
// 2. REGISTRATIONS & QR TICKET GENERATION
// -------------------------------------------------------------
const RegistrationZodSchema = z.object({
  team_name: z.string().optional(),
  teamName: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  domain: z.string().optional(),
  members: z.array(z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional().default(''),
    college: z.string().optional().default(''),
    department: z.string().optional().default(''),
    year: z.string().optional().default(''),
    is_leader: z.boolean().optional().default(false)
  })).optional(),
  fee_type: z.string().optional().default('online'),
  custom_fields: z.record(z.any()).optional().default({})
});

async function handleRegistration(req, res) {
  try {
    const validated = RegistrationZodSchema.parse(req.body);
    const db = loadDb();
    const teams = db.teams || [];

    // Normalize team name and members
    const teamName = (validated.team_name || validated.teamName || `${validated.name || 'Participant'}'s Team`).trim();
    let members = validated.members;

    if (!members || members.length === 0) {
      if (!validated.name || !validated.email) {
        return res.status(400).json({
          success: false,
          message: 'Either team members or name and email are required'
        });
      }
      members = [{
        name: validated.name,
        email: validated.email,
        phone: req.body.phone || '',
        college: req.body.college || 'Engineering Institute',
        department: req.body.department || 'CSE',
        year: req.body.year || '3rd Year',
        is_leader: true
      }];
    }

    // Check duplicate team name
    if (teams.some(t => (t.team_name || '').toLowerCase() === teamName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Team name "${teamName}" is already taken. Please choose another.`
      });
    }

    const leader = members.find(m => m.is_leader) || members[0];
    leader.is_leader = true;

    // Check duplicate leader email
    for (const t of teams) {
      for (const m of (t.members || [])) {
        if ((m.email || '').toLowerCase() === leader.email.toLowerCase()) {
          return res.status(400).json({
            success: false,
            message: `A team member with email "${leader.email}" is already registered in team "${t.team_name}".`
          });
        }
      }
    }

    const nextNum = teams.length + 1;
    const regId = `BTS26-${String(nextNum).padStart(4, '0')}`;
    const teamId = `team-bts-${crypto.randomBytes(4).toString('hex')}`;
    const qrToken = `QR-${regId}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const feeAmount = validated.fee_type === 'spot' ? 1500 : 1000;

    // Generate real QR code image Data URL
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(qrToken, {
        color: { dark: '#00FFAA', light: '#0A0A0F' },
        margin: 2,
        width: 300
      });
    } catch (qrErr) {
      // fallback
    }

    const newTeam = {
      team_id: teamId,
      registration_id: regId,
      event_id: 'TECHSPIRIT-2026',
      team_name: teamName,
      domain: validated.domain || req.body.domain || 'Open Innovation',
      leader_name: leader.name,
      leader_email: leader.email,
      leader_phone: leader.phone || '',
      college: leader.college || '',
      team_size: members.length,
      members,
      registration_status: 'CONFIRMED',
      payment_status: 'PAID', // mark active for demo
      amount: feeAmount,
      fee_type: validated.fee_type,
      qr_token: qrToken,
      qr_code_url: qrDataUrl,
      custom_fields: validated.custom_fields || {},
      created_at: new Date().toISOString(),
      checked_in: false,
      checkin_time: null
    };

    teams.push(newTeam);
    db.teams = teams;
    saveDb(db);

    logAudit('REGISTER_TEAM', `Team ${teamName} (${regId}) registered with ${members.length} members.`, leader.email);

    // Sync to Google Sheets
    appendRegistrationRow(newTeam, members);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! QR Pass issued.',
      team_id: teamId,
      registration_id: regId,
      qr_token: qrToken,
      qr_code_url: qrDataUrl,
      amount: feeAmount,
      team: newTeam
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: err.errors
      });
    }
    return res.status(500).json({ success: false, message: err.message });
  }
}

app.post('/api/register', handleRegistration);
app.post('/api/registrations', handleRegistration);

app.get('/api/team/pass/:token', (req, res) => {
  const db = loadDb();
  const token = req.params.token.trim();
  const team = (db.teams || []).find(t => t.qr_token === token || t.registration_id === token || t.team_id === token);
  if (!team) {
    return res.status(404).json({ success: false, message: 'Registration record not found' });
  }
  res.json({ success: true, team });
});

// Get team details for logged-in user by email
app.get('/api/teams/user/:email', (req, res) => {
  const db = loadDb();
  const email = (req.params.email || '').toLowerCase().trim();
  const teams = (db.teams || []).filter(t => 
    (t.leader_email || '').toLowerCase() === email || 
    (t.members || []).some(m => (m.email || '').toLowerCase() === email)
  );
  res.json({
    success: true,
    teams,
    team: teams[0] || null
  });
});

// Enter or update team details for logged-in user
app.post('/api/teams/user/save', async (req, res) => {
  try {
    const { team_name, domain, leader_name, leader_email, leader_phone, college, members, project_summary } = req.body;
    if (!team_name || !leader_email) {
      return res.status(400).json({ success: false, message: 'Team Name and Leader Email are required' });
    }

    const db = loadDb();
    if (!db.teams) db.teams = [];

    const normEmail = leader_email.toLowerCase().trim();
    let existingIndex = db.teams.findIndex(t => 
      (t.leader_email || '').toLowerCase() === normEmail ||
      (t.members || []).some(m => (m.email || '').toLowerCase() === normEmail)
    );

    let qrDataUrl = '';
    let qrToken = '';
    let regId = '';
    let teamId = '';

    const memberList = Array.isArray(members) && members.length > 0 ? members : [
      {
        name: leader_name || 'Leader',
        email: leader_email,
        phone: leader_phone || '',
        college: college || 'Engineering Institute',
        department: 'Technology',
        year: '3rd Year',
        is_leader: true
      }
    ];

    if (existingIndex >= 0) {
      const existing = db.teams[existingIndex];
      teamId = existing.team_id;
      regId = existing.registration_id;
      qrToken = existing.qr_token;
      qrDataUrl = existing.qr_code_url || '';

      if (!qrDataUrl && qrToken) {
        try {
          qrDataUrl = await QRCode.toDataURL(qrToken, {
            color: { dark: '#00FFAA', light: '#0A0A0F' },
            margin: 2,
            width: 300
          });
        } catch (e) {}
      }

      existing.team_name = team_name;
      existing.domain = domain || existing.domain || 'Artificial Intelligence & ML';
      existing.leader_name = leader_name || existing.leader_name;
      existing.leader_email = leader_email;
      existing.leader_phone = leader_phone || existing.leader_phone || '';
      existing.college = college || existing.college || '';
      existing.project_summary = project_summary || existing.project_summary || '';
      existing.team_size = memberList.length;
      existing.members = memberList;
      existing.qr_code_url = qrDataUrl;
      existing.updated_at = new Date().toISOString();

      saveDb(db);
      logAudit('UPDATE_TEAM_DETAILS', `Team ${team_name} (${regId}) details updated by ${leader_email}.`, leader_email);
      appendRegistrationRow(existing, memberList);

      return res.json({
        success: true,
        message: 'Team details updated successfully!',
        team: existing
      });
    } else {
      const nextNum = db.teams.length + 1;
      regId = `BTS26-${String(nextNum).padStart(4, '0')}`;
      teamId = `team-bts-${crypto.randomBytes(4).toString('hex')}`;
      qrToken = `QR-${regId}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      try {
        qrDataUrl = await QRCode.toDataURL(qrToken, {
          color: { dark: '#00FFAA', light: '#0A0A0F' },
          margin: 2,
          width: 300
        });
      } catch (e) {}

      const newTeam = {
        team_id: teamId,
        registration_id: regId,
        event_id: 'TECHSPIRIT-2026',
        team_name,
        domain: domain || 'Artificial Intelligence & ML',
        leader_name: leader_name || 'Leader',
        leader_email,
        leader_phone: leader_phone || '',
        college: college || 'BITS Pilani / Partner Institute',
        team_size: memberList.length,
        members: memberList,
        project_summary: project_summary || '',
        registration_status: 'CONFIRMED',
        payment_status: 'PAID',
        amount: 1000,
        fee_type: 'online',
        qr_token: qrToken,
        qr_code_url: qrDataUrl,
        created_at: new Date().toISOString(),
        checked_in: false,
        checkin_time: null
      };

      db.teams.push(newTeam);
      saveDb(db);
      logAudit('REGISTER_TEAM', `Team ${team_name} (${regId}) created by ${leader_email}.`, leader_email);
      appendRegistrationRow(newTeam, memberList);

      return res.status(201).json({
        success: true,
        message: 'Team details registered and saved successfully!',
        team: newTeam
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. EVENT-DAY QR CHECK-IN SCANNER
// -------------------------------------------------------------
function handleCheckin(req, res) {
  const db = loadDb();
  const qrToken = (req.body.qr_token || req.body.token || '').trim();
  const scannedBy = req.body.scanned_by || req.user?.name || 'Staff Desk';

  if (!qrToken) {
    return res.status(400).json({ success: false, message: 'QR token is required' });
  }

  const team = (db.teams || []).find(t => t.qr_token === qrToken || t.registration_id === qrToken);
  if (!team) {
    return res.status(404).json({ success: false, message: 'Invalid QR pass or registration ID.' });
  }

  // Prevent duplicate check-ins
  if (team.checked_in) {
    return res.json({
      success: false,
      already_checked_in: true,
      message: `Team "${team.team_name}" was ALREADY checked in on ${team.checkin_time}!`,
      team
    });
  }

  const now = new Date().toISOString();
  team.checked_in = true;
  team.checkin_time = now;
  team.registration_status = 'CHECKED_IN';

  const checkinRecord = {
    checkin_id: `chk-${crypto.randomBytes(4).toString('hex')}`,
    team_id: team.team_id,
    registration_id: team.registration_id,
    team_name: team.team_name,
    scanned_by: scannedBy,
    timestamp: now,
    entry_status: 'APPROVED'
  };

  if (!db.checkins) db.checkins = [];
  db.checkins.push(checkinRecord);
  saveDb(db);

  logAudit('TEAM_CHECKED_IN', `Team ${team.team_name} (${team.registration_id}) checked in by ${scannedBy}.`, scannedBy);

  return res.json({
    success: true,
    already_checked_in: false,
    message: `Check-in verified! Welcome Team "${team.team_name}" to BITS TECHSPIRIT 2026.`,
    team,
    checkin: checkinRecord
  });
}

app.post('/api/operations/checkin', handleCheckin);
app.post('/api/scanner/checkin', handleCheckin);

app.get('/api/operations/checkins', (req, res) => {
  const db = loadDb();
  res.json({
    success: true,
    checkins: (db.checkins || []).slice().reverse()
  });
});

app.get('/api/operations/volunteers', (req, res) => {
  const db = loadDb();
  if (!db.volunteers || db.volunteers.length === 0) {
    db.volunteers = [
      { id: 'vol-1', name: 'Aakash Verma', email: 'aakash.v@bitstechspirit.org', phone: '+91 98451 22301', desk: 'Desk Alpha (Main Gate)', role: 'QR Verification Lead', shift: 'Morning (08:00 - 14:00)', active: true, scansCount: 14 },
      { id: 'vol-2', name: 'Pooja Iyer', email: 'pooja.i@bitstechspirit.org', phone: '+91 97120 44512', desk: 'Desk Beta (Auditorium)', role: 'Attendee Kit & ID Badges', shift: 'Morning (08:00 - 14:00)', active: true, scansCount: 9 },
      { id: 'vol-3', name: 'Kunal Deshmukh', email: 'kunal.d@bitstechspirit.org', phone: '+91 99801 88310', desk: 'Desk Gamma (Hardware Lab)', role: 'Component & Sensor Vault', shift: 'All Day (09:00 - 18:00)', active: true, scansCount: 5 },
      { id: 'vol-4', name: 'Simran Kaur', email: 'simran.k@bitstechspirit.org', phone: '+91 96500 11982', desk: 'Desk Delta (Dining & Cafe)', role: 'Meal Pass Dispatcher', shift: 'Afternoon (12:00 - 18:00)', active: true, scansCount: 0 }
    ];
    saveDb(db);
  }
  res.json({ success: true, volunteers: db.volunteers });
});

app.post('/api/operations/volunteers', (req, res) => {
  const { name, email, phone, desk, role, shift } = req.body;
  if (!name || !desk) {
    return res.status(400).json({ success: false, message: 'Name and Desk are required' });
  }
  const db = loadDb();
  if (!db.volunteers) db.volunteers = [];
  const newVol = {
    id: `vol-${Date.now()}`,
    name,
    email: email || '',
    phone: phone || '',
    desk,
    role: role || 'Floor Volunteer',
    shift: shift || 'General (09:00 - 17:00)',
    active: true,
    scansCount: 0
  };
  db.volunteers.push(newVol);
  saveDb(db);
  logAudit('ADD_VOLUNTEER', `Added volunteer ${name} assigned to ${desk}.`, name);
  res.status(201).json({ success: true, volunteer: newVol });
});

app.post('/api/operations/kit-distribution', (req, res) => {
  const { team_id, badges_issued, swag_distributed, meal_passes_given, wifi_credentials_passed } = req.body;
  const db = loadDb();
  const team = (db.teams || []).find(t => t.team_id === team_id || t.registration_id === team_id);
  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }
  if (!team.kit_distribution) team.kit_distribution = {};
  team.kit_distribution = {
    badges_issued: Boolean(badges_issued),
    swag_distributed: Boolean(swag_distributed),
    meal_passes_given: Boolean(meal_passes_given),
    wifi_credentials_passed: Boolean(wifi_credentials_passed),
    updated_at: new Date().toISOString()
  };
  saveDb(db);
  logAudit('KIT_DISTRIBUTION', `Updated kit distribution for ${team.team_name} (${team.registration_id}).`);
  res.json({ success: true, kit_distribution: team.kit_distribution });
});

// -------------------------------------------------------------
// 4. AUTHENTICATION (EMAIL/PASSWORD & GOOGLE OAUTH)
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const db = loadDb();
  const user = (db.users || []).find(u => (u.email || '').toLowerCase() === email.toLowerCase());

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = createAccessToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  res.json({
    success: true,
    access_token: token,
    token_type: 'bearer',
    user: {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.post('/api/auth/google', (req, res) => {
  const { credential } = req.body;
  let email = 'admin@bitstechspirit.org';
  let name = 'Google User';

  if (credential) {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
      if (payload.email) {
        email = payload.email;
        name = payload.name || payload.email.split('@')[0];
      }
    } catch (e) {
      // safe fallback
    }
  }

  const db = loadDb();
  let user = (db.users || []).find(u => (u.email || '').toLowerCase() === email.toLowerCase());

  if (!user) {
    user = {
      user_id: `usr-${crypto.randomBytes(4).toString('hex')}`,
      email,
      name,
      role: 'super_admin',
      created_at: new Date().toISOString()
    };
    if (!db.users) db.users = [];
    db.users.push(user);
    saveDb(db);
  }

  const token = createAccessToken({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  res.json({
    success: true,
    access_token: token,
    token_type: 'bearer',
    user
  });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// -------------------------------------------------------------
// 5. SUBMISSIONS & JUDGING
// -------------------------------------------------------------
app.get('/api/submissions', (req, res) => {
  const db = loadDb();
  res.json(db.submissions || []);
});

app.post('/api/submissions', (req, res) => {
  const { team_id, project_title, project_description, domain, github_url, ppt_url, demo_video_url, tech_stack } = req.body;
  const db = loadDb();
  const teams = db.teams || [];
  const team = teams.find(t => t.team_id === team_id || t.registration_id === team_id);

  if (!team) {
    return res.status(404).json({ success: false, message: 'Team registration not found' });
  }

  const submissions = db.submissions || [];
  const existing = submissions.find(s => s.team_id === team.team_id);

  const submissionRecord = {
    submission_id: existing ? existing.submission_id : `sub-${crypto.randomBytes(4).toString('hex')}`,
    team_id: team.team_id,
    registration_id: team.registration_id,
    team_name: team.team_name,
    domain: domain || team.domain,
    project_title,
    project_description,
    github_url,
    ppt_url: ppt_url || '',
    demo_video_url: demo_video_url || '',
    tech_stack: tech_stack || [],
    submitted_at: new Date().toISOString()
  };

  if (existing) {
    db.submissions = submissions.map(s => s.team_id === team.team_id ? submissionRecord : s);
  } else {
    submissions.push(submissionRecord);
    db.submissions = submissions;
  }

  saveDb(db);
  logAudit('PROJECT_SUBMISSION', `Project "${project_title}" submitted for team ${team.team_name}.`, team.team_name);

  res.json({ success: true, submission: submissionRecord });
});

app.post('/api/judging/score', (req, res) => {
  const { submission_id, judge_name, judge_id, innovation, implementation, impact, design_ux, presentation, feedback } = req.body;
  const db = loadDb();
  const sub = (db.submissions || []).find(s => s.submission_id === submission_id);

  if (!sub) {
    return res.status(404).json({ success: false, message: 'Submission not found' });
  }

  const total = (Number(innovation) || 0) + (Number(implementation) || 0) + (Number(impact) || 0) + (Number(design_ux) || 0) + (Number(presentation) || 0);
  const scoreRecord = {
    score_id: `score-${crypto.randomBytes(4).toString('hex')}`,
    submission_id,
    team_id: sub.team_id,
    team_name: sub.team_name,
    registration_id: sub.registration_id,
    judge_id: judge_id || 'usr-judge-01',
    judge_name: judge_name || 'Judge',
    innovation: Number(innovation) || 0,
    implementation: Number(implementation) || 0,
    impact: Number(impact) || 0,
    design_ux: Number(design_ux) || 0,
    presentation: Number(presentation) || 0,
    total,
    feedback: feedback || '',
    scored_at: new Date().toISOString()
  };

  const scores = db.scores || [];
  const filtered = scores.filter(s => !(s.submission_id === submission_id && s.judge_id === scoreRecord.judge_id));
  filtered.push(scoreRecord);
  db.scores = filtered;
  saveDb(db);

  logAudit('SCORE_SUBMITTED', `Judge ${scoreRecord.judge_name} awarded ${total}/100 to ${sub.team_name}.`, scoreRecord.judge_name);

  res.json({ success: true, score: scoreRecord });
});

app.get('/api/leaderboard', (req, res) => {
  const db = loadDb();
  const submissions = db.submissions || [];
  const scores = db.scores || [];

  const scoresBySub = {};
  for (const s of scores) {
    if (!scoresBySub[s.submission_id]) scoresBySub[s.submission_id] = [];
    scoresBySub[s.submission_id].push(s.total || 0);
  }

  const ranked = submissions.map(sub => {
    const list = scoresBySub[sub.submission_id] || [];
    const avg = list.length ? Number((list.reduce((a, b) => a + b, 0) / list.length).toFixed(1)) : 0;
    return {
      submission_id: sub.submission_id,
      registration_id: sub.registration_id,
      team_name: sub.team_name,
      domain: sub.domain,
      project_title: sub.project_title,
      scores_count: list.length,
      score: avg
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  ranked.forEach((item, idx) => { item.rank = idx + 1; });

  res.json(ranked);
});

// -------------------------------------------------------------
// 6. ADMIN CONTROL CENTER
// -------------------------------------------------------------
app.get('/api/admin/metrics', (req, res) => {
  const db = loadDb();
  const teams = db.teams || [];
  const payments = db.payments || [];
  const submissions = db.submissions || [];

  const totalTeams = teams.length;
  const totalParticipants = teams.reduce((acc, t) => acc + (t.members ? t.members.length : 1), 0);
  const verifiedPaymentsCount = teams.filter(t => t.payment_status === 'PAID').length;
  const totalRevenue = payments.filter(p => p.status === 'SUCCESS').reduce((acc, p) => acc + (p.amount || 0), 0);
  const checkedInCount = teams.filter(t => t.checked_in).length;

  res.json({
    total_teams: totalTeams,
    total_participants: totalParticipants,
    verified_payments_count: verifiedPaymentsCount,
    total_revenue: totalRevenue,
    pending_payments_count: totalTeams - verifiedPaymentsCount,
    checked_in_count: checkedInCount,
    submissions_count: submissions.length
  });
});

app.get('/api/admin/teams', (req, res) => {
  const db = loadDb();
  res.json(db.teams || []);
});

app.patch('/api/admin/teams/:team_id', (req, res) => {
  const db = loadDb();
  const team = (db.teams || []).find(t => t.team_id === req.params.team_id);
  if (!team) {
    return res.status(404).json({ success: false, message: 'Team not found' });
  }

  Object.assign(team, req.body);
  saveDb(db);
  logAudit('UPDATE_TEAM', `Admin updated team ${team.team_name} (${team.registration_id}).`);
  res.json({ success: true, team });
});

app.delete('/api/admin/teams/:team_id', (req, res) => {
  const db = loadDb();
  db.teams = (db.teams || []).filter(t => t.team_id !== req.params.team_id);
  saveDb(db);
  logAudit('DELETE_TEAM', `Admin deleted team ID ${req.params.team_id}.`);
  res.json({ success: true });
});

// Sync to Google Sheets
app.post('/api/admin/sync-sheets', async (req, res) => {
  const result = await syncAllToGoogleSheets();
  logAudit('SYNC_GOOGLE_SHEETS', `Full database sync executed. Result: ${result.message || 'Complete'}`);
  res.json(result);
});

app.get('/api/admin/audit-logs', (req, res) => {
  const db = loadDb();
  const logs = (db.audit_logs || []).slice().reverse();
  res.json(logs);
});

// -------------------------------------------------------------
// 7. PRODUCTION FRONTEND SERVING (SINGLE SERVICE ARCHITECTURE)
// -------------------------------------------------------------
const frontendPath = path.resolve(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

module.exports = app;
