export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-3">
            <h5>Ember &amp; Vine</h5>
            <p className="small mb-0">A modern wood-fired restaurant, cooking with fire and garden produce since 2020.</p>
          </div>
          <div className="col-md-3">
            <h5>Contact</h5>
            <p className="small mb-1">128 Riverside Road, Phnom Penh</p>
            <p className="small mb-1">+855 12 345 678</p>
            <p className="small mb-0">hello@emberandvine.com</p>
          </div>
          <div className="col-md-3">
            <h5>Opening Hours</h5>
            <p className="small mb-1">Mon &ndash; Fri: 11am &ndash; 10pm</p>
            <p className="small mb-0">Sat &ndash; Sun: 9am &ndash; 11pm</p>
          </div>
          <div className="col-md-3">
            <h5>Follow Us</h5>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22C18.34 21.21 22 17.06 22 12.06z"/></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="fine-print text-center">&copy; 2026 Ember &amp; Vine Restaurant. All rights reserved.</div>
      </div>
    </footer>
  );
}
