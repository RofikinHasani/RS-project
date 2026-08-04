import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { api } from '../../lib/api.js';

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const STAT_CARDS = [
  { key: 'total_customers', label: 'Customers', tone: '#E4EEF7', color: '#2A5F8A', icon: <><circle cx="9" cy="7" r="3" /><path d="M2 20c0-3.3 2.7-5.5 6-5.5S14 16.7 14 20" /><circle cx="17" cy="8" r="2.3" /><path d="M15.5 13.5c2.6.4 4 2.2 4 5.5" /></> },
  { key: 'total_orders', label: 'Total Orders', tone: '#FBF1DC', color: '#97701E', icon: <><path d="M4 2l1.4 3H20l-1.8 8H7.5L6 5" /><circle cx="8.5" cy="20" r="1.4" /><circle cx="16" cy="20" r="1.4" /></> },
  { key: 'total_revenue', label: 'Total Revenue', tone: '#E4F1E8', color: '#2F6B4F', isMoney: true, icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.2c0 3-6 1.5-6 4.5 0 1.4 1.3 2.3 3 2.3s3-1 3-2.3" /></> },
  { key: 'orders_today', label: 'Orders Today', tone: '#FBE7E4', color: '#A5321E', icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M12 14l2 2 4-4" /></> },
  { key: 'total_reservations', label: 'Reservations', tone: '#EEECE6', color: '#6E6E6E', icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { key: 'total_menu_items', label: 'Menu Items', tone: '#FBF1DC', color: '#97701E', icon: <><path d="M4 3v7a3 3 0 003 3v8" /><path d="M7 3v7" /><path d="M10 3v7" /><path d="M20 3c-2 1-3 3-3 6s1 4 3 5v7" /></> },
];

export default function AdminOverview() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setError('');
    Promise.all([api.getAdminStats(token), api.getAdminOrders(token), api.getAdminReservations(token)])
      .then(([statsData, ordersData, reservationsData]) => {
        if (cancelled) return;
        setStats(statsData);
        setOrders((Array.isArray(ordersData) ? ordersData : []).slice(0, 5));
        setReservations((Array.isArray(reservationsData) ? reservationsData : []).slice(0, 5));
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not load dashboard data.'));
    return () => { cancelled = true; };
  }, [token]);

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="auth-error mb-4">{error}</div>}

      <div className="row g-3 mb-4">
        {STAT_CARDS.map((c) => (
          <div className="col-6 col-lg-4 col-xl-2" key={c.key}>
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ background: c.tone, color: c.color }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg>
              </div>
              <div>
                <div className="admin-stat-value">
                  {stats ? (c.isMoney ? `$${Number(stats[c.key]).toFixed(2)}` : stats[c.key]) : '—'}
                </div>
                <div className="admin-stat-label">{c.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="btn btn-outline-ink btn-sm">View all</Link>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Placed</th><th>Status</th></tr></thead>
                <tbody>
                  {orders === null && <tr><td colSpan={5} className="admin-empty">Loading…</td></tr>}
                  {orders?.length === 0 && <tr><td colSpan={5} className="admin-empty">No orders yet.</td></tr>}
                  {orders?.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.order_no}</td>
                      <td>{o.user?.name || '—'}</td>
                      <td>${Number(o.total).toFixed(2)}</td>
                      <td className="muted-sub">{formatDateTime(o.created_at)}</td>
                      <td><StatusBadge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="admin-card h-100">
            <div className="admin-card-header">
              <h2>Upcoming Reservations</h2>
              <Link to="/admin/reservations" className="btn btn-outline-ink btn-sm">View all</Link>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead><tr><th>Guest</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {reservations === null && <tr><td colSpan={3} className="admin-empty">Loading…</td></tr>}
                  {reservations?.length === 0 && <tr><td colSpan={3} className="admin-empty">No reservations yet.</td></tr>}
                  {reservations?.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td className="muted-sub">{r.date} · {r.time?.slice(0, 5)}</td>
                      <td><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
