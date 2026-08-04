import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const STATUS_LABEL = {
  placed: 'Placed',
  preparing: 'Preparing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState(null); // null = loading
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError('');
      try {
        const data = await api.getOrders(token);
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load your orders. Please try again.');
          setOrders([]);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb-ticket mb-2"><Link to="/">Home</Link><span className="sep">/</span>My Orders</div>
          <h1>My Orders</h1>
        </div>
      </header>

      <section>
        <div className="container">
          {orders === null && (
            <p className="text-center text-muted">Loading your orders…</p>
          )}

          {error && (
            <div className="auth-error mb-4">{error}</div>
          )}

          {orders !== null && orders.length === 0 && !error && (
            <div className="text-center">
              <p className="text-muted mb-3">You haven&rsquo;t placed any orders yet.</p>
              <Link to="/menu" className="btn btn-ember">Browse the Menu</Link>
            </div>
          )}

          {orders !== null && orders.length > 0 && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {orders.map((order) => (
                  <div className="ticket-card mb-4" key={order.id}>
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                      <div>
                        <h5 className="mb-1">Order #{order.order_no}</h5>
                        <p className="small text-muted mb-0">{formatDateTime(order.created_at)}</p>
                      </div>
                      <span className="badge-cat">{STATUS_LABEL[order.status] || order.status}</span>
                    </div>

                    <div className="invoice-box">
                      {(order.items || []).map((item) => (
                        <div className="inv-row" key={item.id}>
                          <span>{item.quantity} &times; {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="inv-row"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
                      <div className="inv-row"><span>Tax</span><span>${Number(order.tax).toFixed(2)}</span></div>
                      <div className="inv-row"><strong>Total</strong><strong>${Number(order.total).toFixed(2)}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
