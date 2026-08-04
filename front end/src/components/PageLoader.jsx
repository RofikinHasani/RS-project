import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="pageLoader" className={loaded ? 'loaded' : ''}>
      <div className="flame-spinner"></div>
    </div>
  );
}
