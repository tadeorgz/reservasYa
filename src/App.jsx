import { BrowserRouter, Routes, Route, } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import BusinessTypePage from './pages/BusinessTypePage';
import ServicesPage from './pages/ServicesPage';
import DashboardPage from './pages/DashboardPage';
import BusinessSettingsPage from './pages/BusinessSettingsPage';
import PublicBookingPage from './pages/PublicBookingPage';
import ServicesAdminPage from './pages/ServicesAdminPage';
import ProfessionalsAdminPage from './pages/ProfessionalsAdminPage';
import CustomersAdminPage from './pages/CustomersAdminPage';
import RevenuePage from './pages/RevenuePage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/tipo-negocio" element={<BusinessTypePage />} />
        <Route path="/servicios" element={<ServicesPage />} />

        <Route path="/reservas/:slug" element={<PublicBookingPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/configuracion"
          element={
            <ProtectedRoute>
              <BusinessSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/servicios"
          element={
            <ProtectedRoute>
              <ServicesAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/personal"
          element={
            <ProtectedRoute>
              <ProfessionalsAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/clientes"
          element={
            <ProtectedRoute>
              <CustomersAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ingresos"
          element={
            <ProtectedRoute>
              <RevenuePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;