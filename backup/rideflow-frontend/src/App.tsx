import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Landing } from './pages/Landing';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function ProtectedRoute({ role, children }: { role?: string, children: React.ReactNode }) {
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role && user?.role && role.toLowerCase() !== user.role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/customer" element={<ProtectedRoute role="Rider"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/rider" element={<ProtectedRoute role="Rider"><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute role="Driver"><DriverDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
