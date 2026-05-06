import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import LandingPage from '@/pages/Landing';
import RiderDashboard from '@/pages/RiderDashboard';
import DriverDashboard from '@/pages/DriverDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import LoginPage from '@/pages/Auth/LoginPage';
import SignUpPage from '@/pages/Auth/SignUpPage';
import { SignInModal } from '@/pages/Auth/SignInModal';
import { SignUpModal } from '@/pages/Auth/SignUpModal';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user } = useAppStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role && !allowedRoles.includes(user.role)) {
    // Redirect to user's own dashboard
    const paths: Record<string, string> = {
      rider: '/rider',
      driver: '/driver',
      admin: '/admin',
    };
    return <Navigate to={paths[user.role] || '/'} replace />;
  }

  return <>{children}</>;
}

function DashboardRedirect() {
  const { user } = useAppStore();
  if (!user?.role) return <Navigate to="/" replace />;
  const paths: Record<string, string> = {
    rider: '/rider',
    driver: '/driver',
    admin: '/admin',
  };
  return <Navigate to={paths[user.role] || '/'} replace />;
}

/** Redirect already-logged-in users away from auth pages */
function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAppStore();
  if (user) return <DashboardRedirect />;
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden="true" />

      {/* Page routes with AnimatePresence transitions */}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <LoginPage />
              </GuestOnly>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestOnly>
                <SignUpPage />
              </GuestOnly>
            }
          />
          <Route
            path="/rider"
            element={
              <ProtectedRoute allowedRoles={['rider']}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rider/trips"
            element={
              <ProtectedRoute allowedRoles={['rider']}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rider/settings"
            element={
              <ProtectedRoute allowedRoles={['rider']}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/earnings"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/trips"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/settings"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/map"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/trips"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/disputes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Global modals — mounted above everything */}
      <SignInModal />
      <SignUpModal />
    </>
  );
}
