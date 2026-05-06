import axios from 'axios';

// In dev, Vite proxies /engineers, /recruiters etc. to http://localhost:8000
// In production, set VITE_API_URL=https://your-api.com
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hah_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ─── Auth helpers ──────────────────────────────────────────────────────────
export const engineerLogin = (email, password) =>
  api.post('/engineers/login', { email, password });

export const engineerSignup = (data) => api.post('/engineers/', data);

export const recruiterLogin = (email, password) =>
  api.post('/recruiters/login', { email, password });

export const recruiterSignup = (data) => api.post('/recruiters/', data);

export const adminLogin = (email, password) =>
  api.post('/admin/login', { email, password });

// ─── Engineers ─────────────────────────────────────────────────────────────
export const getEngineers = () => api.get('/engineers/');

export const searchEngineers = (filters) =>
  api.post('/engineers/search', filters);

export const updateEngineer = (id, data) => api.put(`/engineers/${id}`, data);

// ─── Admin ─────────────────────────────────────────────────────────────────
export const reviewRecruiter = (recruiterId, status, rejection_msg) =>
  api.post(`/admin/review-recruiter/${recruiterId}`, { status, rejection_msg });

// ─── Agent threads ─────────────────────────────────────────────────────────
export const createThread = (first_message) =>
  api.post('/agent/threads', { first_message });

export const listThreads = () => api.get('/agent/threads');

export const deleteThread = (threadId) =>
  api.delete(`/agent/threads/${threadId}`);

export const getThreadMessages = (threadId) =>
  api.get(`/agent/threads/${threadId}/messages`);


// Streaming chat — returns a raw fetch Response
export const chatInThread = async (threadId, message) => {
  const token = localStorage.getItem('hah_token');
  const base = API_BASE || window.location.origin;
  return fetch(`${base}/agent/threads/${threadId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });
};

export default api;
