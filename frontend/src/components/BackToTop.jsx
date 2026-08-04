import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      id="backToTop"
      aria-label="Back to top"
      style={{ display: visible ? 'flex' : 'none' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      &uarr;
    </button>
  );
}
