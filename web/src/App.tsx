import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { HomePage } from './pages/HomePage';
import { ProjectPropertiesPage } from './pages/ProjectPropertiesPage';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { UserDashboard } from './pages/UserDashboard';
import { AboutPage } from './pages/AboutPage';
import { MainLayout } from './components/layouts/MainLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminProperties } from './pages/admin/AdminProperties';
import { AdminPricingRules } from './pages/admin/AdminPricingRules';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminTenants } from './pages/admin/AdminTenants';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAbout } from './pages/admin/AdminAbout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Main Tenant / Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/properties" element={<HomePage />} />
            <Route path="/projects/:projectName/:type" element={<ProjectPropertiesPage />} />
            
            {/* Public Property Details */}
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />

            {/* Protected User Routes */}
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/login/admin" element={<AdminLoginPage />} />
            
            {/* Protected Admin Routes Wrapper */}
            <Route element={<ProtectedRoute requireAdmin><Outlet /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/pricing-rules" element={<AdminPricingRules />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/admin/tenants" element={<AdminTenants />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/about" element={<AdminAbout />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #d4af37',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
