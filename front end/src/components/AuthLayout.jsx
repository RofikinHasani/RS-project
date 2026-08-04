export default function AuthLayout({ children }) {
  return (
    <div className="auth-screen">
      <div className="auth-visual">
        <img src="/images/hero-bar.jpg" alt="Ember & Vine dining room" className="auth-visual-img" />
        <div className="auth-visual-overlay"></div>
        <div className="auth-visual-content">
          <div className="auth-brand">
            <span className="auth-brand-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 3v7a3 3 0 003 3v8" /><path d="M7 3v7" /><path d="M10 3v7" /><path d="M20 3c-2 1-3 3-3 6s1 4 3 5v7" />
              </svg>
            </span>
            EMBER &amp; VINE
          </div>

          <div className="auth-visual-copy">
            <h1>Reserve your<br />perfect evening.</h1>
            <p>Pre-order your meal, choose your table, and arrive to a dining experience crafted entirely around you.</p>
          </div>

          <div className="auth-stats">
            <div>
              <strong>4.9</strong>
              <span>Rating</span>
            </div>
            <div>
              <strong>6+</strong>
              <span>Years</span>
            </div>
            <div>
              <strong>150+</strong>
              <span>Seats</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-inner">{children}</div>
      </div>
    </div>
  );
}
