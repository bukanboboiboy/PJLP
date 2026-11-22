export const API_BASE_URL =
  process.env.API_BASE_URL || 'https://cctv-lorong.diskominfo.makassarkota.go.id';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/auth/login`,
  me: `${API_BASE_URL}/api/auth/me`,
  monitoringSessions: `${API_BASE_URL}/api/monitoring-sessions`,
  monitoringSession: (sessionId: string | number, limit: number = 1000) =>
    `${API_BASE_URL}/api/monitoring/session/${sessionId}?limit=${limit}`,
  monitoringPengecekan: (lorongId: string | number) =>
    `${API_BASE_URL}/api/monitoring-pengecekan?lorong_id=${lorongId}`,
};
