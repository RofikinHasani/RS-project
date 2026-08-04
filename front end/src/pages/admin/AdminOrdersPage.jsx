import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { api } from '../../lib/api.js';

const ORDER_STATUSES = ['placed', 'preparing', 'completed', 'cancelled'];

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    api.getAdminOrders(token)
      .then((data) => !cancelled && setOrders(Array.isArray(data) ? data : []))
      .catch((err) => !cancelled && setError(err.message || 'Could not load orders.'));
    return () => { cancelled = true; };
  }, [token]);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const term = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesSearch = !term ||
        o.order_no?.toLowerCase().includes(term) ||
        o.user?.name?.toLowerCase().includes(term) ||
        o.user?.email?.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  async function handleStatusChange(orderId, status) {
    const previous = orders;
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await api.updateAdminOrderStatus(token, orderId, status);
    } catch (err) {
      setOrders(previous);
      setError(err.message || 'Could not update order status.');
    }
  }

  return (
    <AdminLayout title="Orders">
      {error && <div className="auth-error mb-4">{error}</div>}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>All Orders {orders ? `(${filtered.length})` : ''}</h2>
        </div>

        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search order #, name, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Placed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders === null && <tr><td colSpan={6} className="admin-empty">Loading orders…</td></tr>}
              {orders && filtered.length === 0 && <tr><td colSpan={6} className="admin-empty">No orders match.</td></tr>}
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td><strong>#{order.order_no}</strong></td>
                  <td>
                    <div>{order.user?.name || '—'}</div>
                    <div className="muted-sub">{order.user?.email}</div>
                  </td>
                  <td className="muted-sub" style={{ maxWidth: 260 }}>
                    {(order.items || []).map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                  </td>
                  <td><strong>${Number(order.total).toFixed(2)}</strong></td>
                  <td className="muted-sub">{formatDateTime(order.created_at)}</td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
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
