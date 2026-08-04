import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { api } from '../../lib/api.js';

const RESERVATION_STATUSES = ['confirmed', 'cancelled'];

function formatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${parseInt(m, 10)}/${parseInt(d, 10)}/${y}`;
}

export default function AdminReservationsPage() {
  const { token } = useAdminAuth();
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    api.getAdminReservations(token)
      .then((data) => !cancelled && setReservations(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message || 'Could not load reservations.'));
    return () => { cancelled = true; };
  }, [token]);

  const filtered = useMemo(() => {
    if (!reservations) return [];
    const term = search.trim().toLowerCase();
    return reservations.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch = !term ||
        r.name?.toLowerCase().includes(term) ||
        r.phone?.toLowerCase().includes(term) ||
        r.booking_ref?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, search, statusFilter]);

  async function handleStatusChange(reservationId, status) {
    const previous = reservations;
    setReservations((list) => list.map((r) => (r.id === reservationId ? { ...r, status } : r)));
    try {
      await api.updateAdminReservationStatus(token, reservationId, status);
    } catch (err) {
      setReservations(previous);
      setError(err.message || 'Could not update reservation status.');
    }
  }

  return (
    <AdminLayout title="Reservations">
      {error && <div className="auth-error mb-4">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Reservations {reservations ? `(${filtered.length})` : ''}</h2>
        </div>

        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search name, phone, ref #…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {RESERVATION_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Guest</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations === null && <tr><td colSpan={7} className="admin-empty">Loading reservations…</td></tr>}
              {reservations && filtered.length === 0 && <tr><td colSpan={7} className="admin-empty">No reservations match.</td></tr>}
              {filtered.map((res) => (
                <tr key={res.id}>
                  <td><strong>{res.booking_ref}</strong></td>
                  <td>
                    <div>{res.name}</div>
                    <div className="muted-sub">{res.phone}</div>
                  </td>
                  <td>{res.guests}</td>
                  <td className="muted-sub">{formatDate(res.date)}</td>
                  <td className="muted-sub">{res.time?.slice(0, 5)}</td>
                  <td className="muted-sub" style={{ maxWidth: 200 }}>{res.note || '—'}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                    >
                      {RESERVATION_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
