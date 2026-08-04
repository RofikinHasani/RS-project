import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.jsx';
import DishImage from '../components/DishImage.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useMenuItems } from '../hooks/useMenuItems.js';

const featured = [
  { name: 'Margherita Pizza', badge: 'Wood-Fired', desc: 'San Marzano tomato, fior di latte, torn basil.' },
  { name: 'Ember Burger', badge: 'Grill', desc: 'Smoked cheddar, charred onion, house pickle.' },
  { name: 'Charred Ribeye Steak', badge: 'Signature', desc: 'Rosemary butter, roasted garlic, seasonal greens.' },
  { name: 'Seafood Paella', badge: 'Seafood', desc: 'Saffron rice, mussels, shrimp, chorizo.' },
  { name: 'Wild Mushroom Pasta', badge: 'Handmade', desc: 'Fresh tagliatelle, thyme, parmesan crust.' },
  { name: "Chef's Grilled Platter", badge: 'Specialty', desc: "Mixed skewers off the open flame, chef's choice sauce." },
  { name: 'Vine Coffee', badge: 'Roast', desc: 'Single origin, roasted weekly in-house.' },
  { name: 'Ash Chocolate Tart', badge: 'Sweet', desc: 'Dark chocolate, sea salt, smoked cream.' },
];

const whyUs = [
  { title: 'Fresh Ingredients', desc: 'Sourced daily from local growers.', path: 'M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1-1-2-1-3 3 2 4 5 4 8a7 7 0 11-14 0c0-5 3-6 6-12z' },
  { title: 'Professional Chef', desc: '15 years mastering the open flame.', icon: 'chef' },
  { title: 'Comfortable Place', desc: 'Warm, unhurried dining room.', icon: 'place' },
  { title: 'Fast Service', desc: 'Attentive, never rushed, always on time.', icon: 'clock' },
];

export default function Home() {
  const { addToCart } = useCart();
  const { menuItems } = useMenuItems();

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <ScrollReveal as="div" className="col-lg-6 text-center text-lg-start">
              <span className="eyebrow">Open Flame Kitchen &middot; Est. 2020</span>
              <h1>We Cook The<br />Flavor You <em>Crave</em></h1>
              <p className="lead mt-3 mb-4 mx-auto mx-lg-0">Ember &amp; Vine pairs a wood-fired kitchen with produce from our own garden rows &mdash; simple plates, honest flavor, no shortcuts.</p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Link to="/menu" className="btn btn-ember btn-lg">Explore Menu</Link>
                <Link to="/reservation" className="btn btn-outline-ink btn-lg">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  Book Table
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal as="div" className="col-lg-6">
              <div className="plate-wrap">
                <div className="plate-ring"></div>
                <div className="plate-inner">
                  {/* Hero photo lives in public/images (not src/assets — that
                      folder is only for the 12 dish photos from menuData.js) */}
                  <img src="/images/hero-bar.jpg" alt="Ember & Vine dining room and bar" className="plate-photo" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </header>

      <section id="featured-menu">
        <div className="container text-center">
          <span className="eyebrow">From the Fire</span>
          <h2 className="section-title">Featured on the Menu</h2>
          <hr className="section-divider" />
          <div className="row g-4 mt-2 text-start">
            {featured.map((f) => {
              const item = menuItems.find((m) => m.name === f.name);
              if (!item) return null;
              return (
                <ScrollReveal as="div" className="col-sm-6 col-lg-3" key={f.name}>
                  <div className="ticket-card h-100">
                    <div className="menu-photo">
                      <DishImage item={item} alt={f.name} />
                    </div>
                    <span className="badge-cat mb-3">{f.badge}</span>
                    <div className="menu-line"><span className="name">{f.name}</span><span className="fill"></span><span className="price">${item.price}</span></div>
                    <p className="text-muted mt-2 mb-0 small">{f.desc}</p>
                    <button className="btn btn-outline-ink btn-sm order-btn mt-3" onClick={() => addToCart(item.id, item.name, item.price)}>Order Now</button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
          <Link to="/menu" className="btn btn-outline-ink mt-5">See Full Menu</Link>
        </div>
      </section>

      <section className="on-dark">
        <div className="container text-center">
          <span className="eyebrow" style={{ color: '#B8912F' }}>Our Promise</span>
          <h2 className="section-title">Why Guests Choose Ember &amp; Vine</h2>
          <hr className="section-divider" />
          <div className="row g-4 mt-3">
            {whyUs.map((w) => (
              <ScrollReveal as="div" className="col-6 col-lg-3" key={w.title}>
                <WhyIcon kind={w.icon} path={w.path} />
                <h5>{w.title}</h5>
                <p className="text-muted small mb-0">{w.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}

function WhyIcon({ kind, path }) {
  if (kind === 'chef') {
    return (
      <svg className="why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4" /><path d="M4 22c0-4.5 3.5-7 8-7s8 2.5 8 7" /></svg>
    );
  }
  if (kind === 'place') {
    return (
      <svg className="why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="12" rx="1" /><path d="M8 8V6a4 4 0 018 0v2" /></svg>
    );
  }
  if (kind === 'clock') {
    return (
      <svg className="why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
    );
  }
  return (
    <svg className="why-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={path} /></svg>
  );
}
