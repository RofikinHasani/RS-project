import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const [validated, setValidated] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sentName, setSentName] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const el = e.target;
    if (el.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(false);
    setSentName(form.name);
    setShowConfirm(true);
  }

  function handleClose() {
    setShowConfirm(false);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <>
      <header className="page-header">
        <div className="container">
          <div className="breadcrumb-ticket mb-2"><Link to="/">Home</Link><span className="sep">/</span>Contact</div>
          <h1>Get In Touch</h1>
        </div>
      </header>

      <section>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="ratio ratio-4x3 mb-4" style={{ borderRadius: 2, overflow: 'hidden' }}>
                <iframe
                  src="https://www.google.com/maps?q=Phnom%20Penh%2C%20Cambodia&output=embed"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ember & Vine location map"
                ></iframe>
              </div>
              <div className="ticket-card">
                <p className="mb-2"><strong>Address:</strong> 128 Riverside Road, Phnom Penh</p>
                <p className="mb-2"><strong>Phone:</strong> +855 12 345 678</p>
                <p className="mb-2"><strong>Email:</strong> hello@emberandvine.com</p>
                <p className="mb-0"><strong>Facebook:</strong> <a href="#">facebook.com/emberandvine</a></p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="ticket-card">
                <form className={`needs-validation${validated ? ' was-validated' : ''}`} noValidate onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="cName" className="form-label">Name</label>
                      <input type="text" className="form-control" id="cName" required minLength={2}
                        value={form.name} onChange={(e) => update('name', e.target.value)} />
                      <div className="invalid-feedback">Please enter your name.</div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="cEmail" className="form-label">Email</label>
                      <input type="email" className="form-control" id="cEmail" required
                        value={form.email} onChange={(e) => update('email', e.target.value)} />
                      <div className="invalid-feedback">Please enter a valid email address.</div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="cSubject" className="form-label">Subject</label>
                      <input type="text" className="form-control" id="cSubject" required
                        value={form.subject} onChange={(e) => update('subject', e.target.value)} />
                      <div className="invalid-feedback">Please enter a subject.</div>
                    </div>
                    <div className="col-12">
                      <label htmlFor="cMessage" className="form-label">Message</label>
                      <textarea className="form-control" id="cMessage" rows={5} required minLength={10}
                        value={form.message} onChange={(e) => update('message', e.target.value)} />
                      <div className="invalid-feedback">Please write a message (at least 10 characters).</div>
                    </div>
                    <div className="col-12 text-center mt-3">
                      <button type="submit" className="btn btn-ember btn-lg px-5">Send Message</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`confirm-modal-overlay${showConfirm ? ' open' : ''}`} onClick={handleClose}>
        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-modal-header">
            <h3>Your Message</h3>
            <button type="button" className="confirm-modal-close" aria-label="Close" onClick={handleClose}>&times;</button>
          </div>

          <div className="invoice-success">
            <div className="check-circle">&#10003;</div>
            <h5 className="mb-2">Message Sent!</h5>
            <p className="text-muted mb-0">
              Thank you, {sentName}. We&rsquo;ve received your message and will get back to you within one business day.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
