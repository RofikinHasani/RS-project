const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Thin wrapper around fetch for the Laravel API. Throws an ApiError with
 * .status and .errors (Laravel's validation error bag) on failure, so
 * callers can show field-level messages.
 */
export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null;
  }
}

async function request(path, { method = 'GET', body, token, params } = {}) {
  let url = `${API_BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    if (qs) url += `?${qs}`;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Your password is incorrect.', 0);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.errors);
  }

  return data;
}

export const api = {
  register: (name, email, password) => request('/register', { method: 'POST', body: { name, email, password } }),
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  logout: (token) => request('/logout', { method: 'POST', token }),
  me: (token) => request('/me', { token }),

  getMenuItems: (params) => request('/menu-items', { params }),

  createOrder: (token, items) => request('/orders', { method: 'POST', token, body: { items } }),
  getOrders: (token) => request('/orders', { token }),

  createReservation: (token, payload) => request('/reservations', { method: 'POST', token, body: payload }),
  getReservations: (token) => request('/reservations', { token }),

  // --- Admin ---
  getAdminStats: (token) => request('/admin/stats', { token }),
  getAdminOrders: (token) => request('/admin/orders', { token }),
  updateAdminOrderStatus: (token, id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', token, body: { status } }),
  getAdminReservations: (token) => request('/admin/reservations', { token }),
  updateAdminReservationStatus: (token, id, status) => request(`/admin/reservations/${id}`, { method: 'PATCH', token, body: { status } }),

  getAdminMenuItems: (token) => request('/admin/menu-items', { token }),
  createAdminMenuItem: (token, payload) => request('/admin/menu-items', { method: 'POST', token, body: payload }),
  updateAdminMenuItem: (token, id, payload) => request(`/admin/menu-items/${id}`, { method: 'PUT', token, body: payload }),
  deleteAdminMenuItem: (token, id) => request(`/admin/menu-items/${id}`, { method: 'DELETE', token }),

  getAdminCustomers: (token) => request('/admin/customers', { token }),
};
