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

export default {
  getEvents,
  registerParticipant,
  loginUser,
  googleLogin,
  verifyCheckin,
  getLeaderboard,
  getAdminMetrics,
  syncGoogleSheets
};
