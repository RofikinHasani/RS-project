import { useEffect, useRef, useState } from 'react';

const testimonials = [
  { name: 'John', role: 'Regular Guest', initial: 'J', color: '#BF5B26', stars: 5, quote: 'The food is very delicious — every plate felt like it was made just for me.' },
  { name: 'David', role: 'First-Time Guest', initial: 'D', color: '#2F6B4F', stars: 5, quote: 'Excellent service from the moment we walked in until dessert arrived.' },
  { name: 'Sophea', role: 'Regular Guest', initial: 'S', color: '#B8912F', stars: 5, quote: 'The ribeye alone is worth the drive. We are already planning our next visit.' },
  { name: 'Maly', role: 'Food Blogger', initial: 'M', color: '#6B4F9E', stars: 5, quote: 'Best wood-fired kitchen I\u2019ve had in the city, hands down.' },
  { name: 'Ratha', role: 'Regular Guest', initial: 'R', color: '#1F7A7A', stars: 5, quote: 'Warm atmosphere, attentive staff, and the garden herbs really shine.' },
  { name: 'Chenda', role: 'First-Time Guest', initial: 'C', color: '#BF5B26', stars: 5, quote: 'Cozy vibe and the lamb was cooked to perfection. We\u2019ll be back.' },
];

const AUTO_ADVANCE_MS = 4500;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  function goTo(i) {
    const n = testimonials.length;
    setIndex(((i % n) + n) % n);
  }
  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  function pauseAndRestart(action) {
    clearInterval(timerRef.current);
    action();
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, AUTO_ADVANCE_MS);
  }

  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="eyebrow" style={{ color: '#B8912F' }}>Testimonials</span>
          <h2 className="section-title">What Our Guests Say</h2>
          <hr className="section-divider" />
        </div>

        <div className="testimonial-slider">
          <button className="testimonial-arrow left" aria-label="Previous testimonial" onClick={() => pauseAndRestart(prev)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="testimonial-track-wrap">
            <div
              className="testimonial-track"
              style={{ transform: `translateX(calc(50% - 180px - ${index * 316}px))` }}
            >
              {testimonials.map((t, i) => (
                <div className={`testimonial-card${i === index ? ' is-active' : ''}`} key={t.name}>
                  <div className="testimonial-stars">{'\u2605'.repeat(t.stars)}</div>
                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testimonial-person">
                    <span className="testimonial-avatar" style={{ background: t.color }}>{t.initial}</span>
                    <span>
                      <strong>{t.name}</strong>
                      <span className="testimonial-role">{t.role}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="testimonial-arrow right" aria-label="Next testimonial" onClick={() => pauseAndRestart(next)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              className={i === index ? 'active' : ''}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => pauseAndRestart(() => goTo(i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
