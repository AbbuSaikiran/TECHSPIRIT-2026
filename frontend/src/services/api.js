const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getEvents() {
  const response = await fetch(`${API_URL}/events`);
  if (!response.ok) {
    throw new Error('Unable to load events');
  }
  return response.json();
}

export async function registerParticipant(data) {
  const response = await fetch(`${API_URL}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Registration failed');
  }
  return result;
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Login failed');
  }
  return result;
}

export async function googleLogin(credential) {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ credential })
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Google authentication failed');
  }
  return result;
}

export async function verifyCheckin(qrToken, scannedBy = 'Staff Desk') {
  const response = await fetch(`${API_URL}/scanner/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ qr_token: qrToken, scanned_by: scannedBy })
  });

  const result = await response.json();
  return result;
}

export async function getLeaderboard() {
  const response = await fetch(`${API_URL}/leaderboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
}

export async function getAdminMetrics() {
  const response = await fetch(`${API_URL}/admin/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
}

export async function syncGoogleSheets() {
  const response = await fetch(`${API_URL}/admin/sync-sheets`, {
    method: 'POST'
  });
  return response.json();
}

export async function getUserTeam(email) {
  if (!email) return { success: false, team: null };
  const response = await fetch(`${API_URL}/teams/user/${encodeURIComponent(email)}`);
  if (!response.ok) {
    return { success: false, team: null };
  }
  return response.json();
}

export async function saveUserTeam(teamData) {
  const response = await fetch(`${API_URL}/teams/user/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(teamData)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to save team details');
  }
  return result;
}

export async function getAdminTeams() {
  const response = await fetch(`${API_URL}/admin/teams`);
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  return response.json();
}

export async function updateAdminTeam(teamId, data) {
  const response = await fetch(`${API_URL}/admin/teams/${encodeURIComponent(teamId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteAdminTeam(teamId) {
  const response = await fetch(`${API_URL}/admin/teams/${encodeURIComponent(teamId)}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function getAdminAuditLogs() {
  const response = await fetch(`${API_URL}/admin/audit-logs`);
  if (!response.ok) {
    throw new Error('Failed to fetch audit logs');
  }
  return response.json();
}

export async function getVolunteers() {
  const response = await fetch(`${API_URL}/operations/volunteers`);
  if (!response.ok) {
    throw new Error('Failed to fetch volunteers');
  }
  return response.json();
}

export async function addVolunteer(volunteerData) {
  const response = await fetch(`${API_URL}/operations/volunteers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(volunteerData)
  });
  return response.json();
}

export async function getCheckins() {
  const response = await fetch(`${API_URL}/operations/checkins`);
  if (!response.ok) {
    throw new Error('Failed to fetch check-ins list');
  }
  return response.json();
}

export async function updateKitDistribution(distributionData) {
  const response = await fetch(`${API_URL}/operations/kit-distribution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(distributionData)
  });
  return response.json();
}

export default {
  getEvents,
  registerParticipant,
  loginUser,
  googleLogin,
  verifyCheckin,
  getLeaderboard,
  getAdminMetrics,
  getAdminTeams,
  updateAdminTeam,
  deleteAdminTeam,
  getAdminAuditLogs,
  getVolunteers,
  addVolunteer,
  getCheckins,
  updateKitDistribution,
  syncGoogleSheets,
  getUserTeam,
  saveUserTeam
};
