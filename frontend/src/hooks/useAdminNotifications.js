import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';

const STORAGE_KEY = 'emberVineAdminNotifBaseline';
const POLL_MS = 20000;

/**
 * Polls GET /api/admin/stats every 20s and reports how many new
 * orders + reservations have come in since the admin last "saw" them
 * (tracked as a baseline total in localStorage, so it survives
 * refreshes/tab closes). Call acknowledge() to clear the badge.
 */
export function useAdminNotifications(token) {
  const [pendingCount, setPendingCount] = useState(0);
  const currentTotalRef = useRef(null);
  const baselineRef = useRef(null);

  const poll = useCallback(async () => {
    if (!token) return;
    try {
      const stats = await api.getAdminStats(token);
      const total = (stats.total_orders || 0) + (stats.total_reservations || 0);
      currentTotalRef.current = total;

      if (baselineRef.current === null) {
        const stored = Number(localStorage.getItem(STORAGE_KEY));
        baselineRef.current = Number.isFinite(stored) && stored > 0 ? stored : total;
      }

      setPendingCount(Math.max(0, total - baselineRef.current));
    } catch {
      // Silent — a failed poll just skips this cycle, no need to
      // surface a whole-page error for a background notification check.
    }
  }, [token]);

  useEffect(() => {
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => clearInterval(id);
  }, [poll]);

  function acknowledge() {
    if (currentTotalRef.current === null) return;
    baselineRef.current = currentTotalRef.current;
    localStorage.setItem(STORAGE_KEY, String(currentTotalRef.current));
    setPendingCount(0);
  }

  return { pendingCount, acknowledge };
}
