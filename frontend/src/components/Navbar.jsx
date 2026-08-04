import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { count, openDrawer } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/menu', label: 'Menu' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reservation', label: 'Reservation' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar navbar-expand-lg fixed-top site-nav navbar-light${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <span className="nav-badge">E</span>Ember <span>&amp;</span> Vine
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMain"
          style={{ borderColor: 'rgba(17,17,17,0.15)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                  to={item.to}
                  end={item.end}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-2 d-flex align-items-center">
              <a
                className="icon-btn"
                href="#"
                id="cartIcon"
                aria-label="Cart"
                onClick={(e) => { e.preventDefault(); openDrawer(); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                <span className={`cart-count${count > 0 ? '' : ' d-none'}`} id="cartCount">{count}</span>
              </a>
              <NavLink className="btn btn-ember" to="/reservation">Book a Table</NavLink>
              {user && (
                <NavLink className="nav-link ms-lg-2" to="/orders">My Orders</NavLink>
              )}
              {user ? (
                <button
                  type="button"
                  className="icon-btn ms-2"
                  aria-label="Log out"
                  title={`Signed in as ${user.name} — Log out`}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              ) : (
                <NavLink className="btn btn-outline-ink ms-2" to="/login">Login</NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out?"
        confirmLabel="Yes, Log Out"
        cancelLabel="Cancel"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => { setShowLogoutConfirm(false); logout(); navigate('/'); }}
      />
    </nav>
  );
}
