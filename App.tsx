import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/PageLoader';
import { ChatWidget } from './components/ChatWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Academy } from './pages/Academy';
import { Booking } from './pages/Booking';
import { Contact } from './pages/Contact';
import { AuthProvider } from './pages/admin/AuthContext';
import { ProtectedRoute } from './pages/admin/ProtectedRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { ProductListPage } from './pages/admin/ProductListPage';
import { ProductFormPage } from './pages/admin/ProductFormPage';

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;
    setIsLoading(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <AuthProvider>
        <Routes location={location}>
          <Route path="/admin" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/productos" element={<ProductListPage />} />
              <Route path="/admin/productos/nuevo" element={<ProductFormPage />} />
              <Route path="/admin/productos/:id" element={<ProductFormPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <PageLoader />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}>
        <Navbar />
        <main className="flex-grow">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/academia" element={<Academy />} />
            <Route path="/turnos" element={<Booking />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
