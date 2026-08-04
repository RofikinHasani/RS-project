import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';

const kitchenPhoto = 'https://images.unsplash.com/photo-1640583342012-4622f31b650d?w=900&h=700&fit=crop&auto=format&q=80';

export default function About() {
  return (
    <>
      <header className="page-header has-photo" style={{ '--photo-url': `url(/images/hero-bar.jpg)` }}>
        <div className="container">
          <div className="breadcrumb-ticket mb-2"><Link to="/">Home</Link><span className="sep">/</span>About</div>
          <h1>About Ember &amp; Vine</h1>
          <p className="lead-sub">Get to know our story, our fire, and the people behind every plate.</p>
        </div>
      </header>

      <section>
        <div className="container">
          <div className="row align-items-center g-5">
            <ScrollReveal as="div" className="col-lg-6 order-lg-1">
              <div className="about-story-photo">
                <img src={kitchenPhoto} alt="Chef preparing food in the Ember & Vine kitchen" loading="lazy" />
              </div>
            </ScrollReveal>
            <ScrollReveal as="div" className="col-lg-6 order-lg-2">
              <span className="eyebrow">Since 2020</span>
              <h2 className="section-title">Our Story</h2>
              <p>Ember &amp; Vine opened in 2020 with one idea at its center: cook simply, cook with fire, and let good ingredients do most of the talking. What began as a single wood-fired oven in a small courtyard has grown into a full kitchen, but the philosophy hasn&rsquo;t changed.</p>
              <p className="mb-0">Every dish that leaves our kitchen passes near the flame in some way &mdash; grilled, roasted, smoked, or charred &mdash; and every plate is finished with something from our own garden rows.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="alt-bg">
        <div className="container">
          <div className="row g-4">
            <ScrollReveal as="div" className="col-md-6">
              <div className="ticket-card text-center h-100">
                <h3 className="display-font mb-0" style={{ color: 'var(--color-ember)' }}>Our Mission</h3>
                <p className="small text-muted mt-2 mb-0">Serve honest, fire-cooked food that makes a table feel like an occasion, every time.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal as="div" className="col-md-6">
              <div className="ticket-card text-center h-100">
                <h3 className="display-font mb-0" style={{ color: 'var(--color-moss)' }}>Our Vision</h3>
                <p className="small text-muted mt-2 mb-0">To be the neighborhood&rsquo;s warmest table &mdash; known for flavor, care, and consistency.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="on-dark">
        <div className="container">
          <div className="text-center mb-5">
            <span className="eyebrow" style={{ color: '#B8912F' }}>Meet the Kitchen</span>
            <h2 className="section-title">Head Chef</h2>
            <hr className="section-divider" />
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="row g-4 align-items-center">
                <ScrollReveal as="div" className="col-md-4 text-center">
                  <div
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{ width: 180, height: 180, background: 'conic-gradient(from 200deg,#CFEAF5,#F7D9E3,#FDEBC8,#DCEBD2,#CFEAF5)' }}
                  >
                    <span className="display-font" style={{ fontSize: '3rem', color: '#111111' }}>SK</span>
                  </div>
                </ScrollReveal>
                <ScrollReveal as="div" className="col-md-8">
                  <h4>Chef Sok Kimheng</h4>
                  <p className="text-muted mb-2">Head Chef &middot; 15 years experience</p>
                  <p className="mb-0">Trained in open-flame cooking across Southeast Asia and Europe, Chef Kimheng builds every menu around what&rsquo;s in season and what the fire can bring out best. His specialty: slow-roasted meats finished with garden herbs.</p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
