import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { api } from '../../lib/api.js';

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminCustomersPage() {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    api.getAdminCustomers(token)
      .then((data) => !cancelled && setCustomers(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message || 'Could not load customers.'));
    return () => { cancelled = true; };
  }, [token]);

  const filtered = useMemo(() => {
    if (!customers) return [];
    const term = search.trim().toLowerCase();
    return customers.filter((c) => !term || c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term));
  }, [customers, search]);

  return (
    <AdminLayout title="Customers">
      {error && <div className="auth-error mb-4">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Customers {customers ? `(${filtered.length})` : ''}</h2>
        </div>

        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Orders</th>
                <th>Reservations</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers === null && <tr><td colSpan={5} className="admin-empty">Loading customers…</td></tr>}
              {customers && filtered.length === 0 && <tr><td colSpan={5} className="admin-empty">No customers match.</td></tr>}
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td className="muted-sub">{c.email}</td>
                  <td>{c.orders_count}</td>
                  <td>{c.reservations_count}</td>
                  <td className="muted-sub">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
