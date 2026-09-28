import { Navigate, Route, Routes } from 'react-router-dom';
import AppShellLayout from './components/layout/AppShellLayout';
import PublicLayout from './components/layout/PublicLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardPage from './features/dashboard/DashboardPage';
import RequestsPage from './features/requests/RequestsPage';
import RequestDetailPage from './features/requests/RequestDetailPage';
import NewRequestPage from './features/requests/NewRequestPage';
import QueuePage from './features/queue/QueuePage';
import UsersPage from './features/users/UsersPage';
import DepartmentsPage from './features/departments/DepartmentsPage';
import AssetsPage from './features/assets/AssetsPage';
import FlaggedRequestsPage from './features/flags/FlaggedRequestsPage';
import IdentityRevealsPage from './features/flags/IdentityRevealsPage';
import ForbiddenPage from './components/common/ForbiddenPage';
import { RequireRole } from './components/common/RequireRole';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<AppShellLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/requests/new" element={<NewRequestPage />} />
        <Route path="/requests/:id" element={<RequestDetailPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route element={<RequireRole roles={['admin']} />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/flagged" element={<FlaggedRequestsPage />} />
          <Route path="/identity-reveals" element={<IdentityRevealsPage />} />
        </Route>
      </Route>

      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
