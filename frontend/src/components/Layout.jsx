import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import PageLoader from './PageLoader.jsx';
import BackToTop from './BackToTop.jsx';
import CartDrawer from './CartDrawer.jsx';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <PageLoader />
      <Navbar />
      {children}
      <Footer />
      <BackToTop />
      <CartDrawer />
    </>
  );
}
