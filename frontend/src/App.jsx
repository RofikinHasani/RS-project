import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import RequireAdminAuth from './components/RequireAdminAuth.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Menu from './pages/Menu.jsx';
import Gallery from './pages/Gallery.jsx';
import Reservation from './pages/Reservation.jsx';
import Orders from './pages/Orders.jsx';
import Contact from './pages/Contact.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminOverview from './pages/admin/AdminOverview.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminReservationsPage from './pages/admin/AdminReservationsPage.jsx';
import AdminMenuPage from './pages/admin/AdminMenuPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin panel — separate login/session, no customer navbar/footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdminAuth><AdminOverview /></RequireAdminAuth>} />
      <Route path="/admin/orders" element={<RequireAdminAuth><AdminOrdersPage /></RequireAdminAuth>} />
      <Route path="/admin/reservations" element={<RequireAdminAuth><AdminReservationsPage /></RequireAdminAuth>} />
      <Route path="/admin/menu" element={<RequireAdminAuth><AdminMenuPage /></RequireAdminAuth>} />
      <Route path="/admin/customers" element={<RequireAdminAuth><AdminCustomersPage /></RequireAdminAuth>} />

      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
