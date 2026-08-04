import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useAdminNotifications } from '../../hooks/useAdminNotifications.js';
import ConfirmDialog from '../ConfirmDialog.jsx';

const navItems = [
  {
    to: '/admin', end: true, label: 'Dashboard',
    icon: <path d="M3 10.5 12 3l9 7.5V21a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />,
  },
  {
    to: '/admin/orders', label: 'Orders',
    icon: <path d="M6 2l1.5 3H21l-2 8H8L6 2zM4 2h2M8 13l-1 4h11M9.5 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />,
  },
  {
    to: '/admin/reservations', label: 'Reservations',
    icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  },
  {
    to: '/admin/menu', label: 'Menu Items',
    icon: <><path d="M4 3v7a3 3 0 003 3v8" /><path d="M7 3v7" /><path d="M10 3v7" /><path d="M20 3c-2 1-3 3-3 6s1 4 3 5v7" /></>,
  },
  {
    to: '/admin/customers', label: 'Customers',
    icon: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="8.5" r="2.5" /><path d="M15.5 14.2c2.9.4 4.5 2.4 4.5 5.8" /></>,
  },
];

export default function AdminLayout({ title, children }) {
  const { admin, token, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { pendingCount, acknowledge } = useAdminNotifications(token);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  const initial = admin?.name?.[0]?.toUpperCase() || 'A';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="nav-badge">E</span>
          Ember &amp; Vine
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to site
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div className="admin-topbar-user">
            <button
              type="button"
              className="icon-btn position-relative"
              aria-label={pendingCount > 0 ? `${pendingCount} new orders or reservations` : 'No new notifications'}
              title={pendingCount > 0 ? `${pendingCount} new order${pendingCount === 1 ? '' : 's'}/reservation${pendingCount === 1 ? '' : 's'}` : 'No new notifications'}
              onClick={() => { acknowledge(); navigate('/admin/orders'); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {pendingCount > 0 && (
                <span
                  className="cart-count"
                  style={{ position: 'absolute', top: -4, right: -4 }}
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </button>
            <div className="text-end d-none d-sm-block">
              <div className="name">{admin?.name}</div>
              <div className="role">Administrator</div>
            </div>
            <div className="admin-avatar">{initial}</div>
            <button type="button" className="icon-btn" aria-label="Log out" title="Log out" onClick={() => setShowLogoutConfirm(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out of the admin panel?"
        confirmLabel="Yes, Log Out"
        cancelLabel="Cancel"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => { setShowLogoutConfirm(false); handleLogout(); }}
      />
    </div>
  );
}
