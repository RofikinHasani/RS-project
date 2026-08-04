import { createContext, useContext, useState } from 'react';
import { api, ApiError } from '../lib/api.js';

const AdminAuthContext = createContext(null);
const ADMIN_AUTH_KEY = 'emberVineAdminAuth';

function loadAdminAuth() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY)) || null;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAdminAuth); // { user, token } | null

  function persist(nextAuth) {
    setAuth(nextAuth);
    if (nextAuth) {
      localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(ADMIN_AUTH_KEY);
    }
  }

  /**
   * Admin login reuses the regular /login endpoint (an admin is just a
   * user with is_admin = true) but rejects — and immediately revokes
   * the token for — anyone who isn't flagged as an admin.
   */
  async function login(email, password) {
    const data = await api.login(email, password); // throws ApiError on failure
    if (!data.user?.is_admin) {
      try {
        await api.logout(data.token);
      } catch {
        // best-effort cleanup
      }
      throw new ApiError('This account does not have admin access.', 403);
    }
    persist({ user: data.user, token: data.token });
  }

  async function logout() {
    if (auth?.token) {
      try {
        await api.logout(auth.token);
      } catch {
        // best-effort — clear the local session regardless
      }
    }
    persist(null);
  }

  const value = {
    admin: auth?.user || null,
    token: auth?.token || null,
    isAdminAuthenticated: !!auth,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}
