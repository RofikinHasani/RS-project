import { createContext, useContext, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);
const AUTH_KEY = 'emberVineAuth';

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth); // { user, token } | null

  function persist(nextAuth) {
    setAuth(nextAuth);
    if (nextAuth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(nextAuth));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  async function login(email, password) {
    const data = await api.login(email, password); // throws ApiError on failure
    persist({ user: data.user, token: data.token });
  }

  async function signup(name, email, password) {
    const data = await api.register(name, email, password); // throws ApiError on failure
    persist({ user: data.user, token: data.token });
  }

  async function logout() {
    if (auth?.token) {
      try {
        await api.logout(auth.token);
      } catch {
        // Best-effort — clear the local session regardless of API result.
      }
    }
    persist(null);
  }

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: !!auth,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
