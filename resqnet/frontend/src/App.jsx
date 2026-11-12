import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AlertBanner from './components/common/AlertBanner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicTracker from './pages/PublicTracker';
import CitizenDashboard from './pages/CitizenDashboard';
import ResponderDashboard from './pages/ResponderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SheltersPage from './pages/SheltersPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'ROLE_ADMIN') return <Navigate to="/admin" replace />;
    if (user?.role === 'ROLE_RESPONDER') return <Navigate to="/responder" replace />;
    return <Navigate to="/citizen" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-red-500 selection:text-white">
      <AlertBanner />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/track" element={<PublicTracker />} />
          <Route path="/shelters" element={<SheltersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Role Protected Routes */}
          <Route
            path="/citizen"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CITIZEN', 'ROLE_ADMIN']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/responder"
            element={
              <ProtectedRoute allowedRoles={['ROLE_RESPONDER', 'ROLE_ADMIN']}>
                <ResponderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <AppContent />
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
