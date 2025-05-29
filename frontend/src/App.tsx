import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectDetail from './pages/Dashboard/ProjectDetail';
import ProjectDeployments from './pages/Dashboard/ProjectDeployments';
import ProjectSettings from './pages/Dashboard/ProjectSettings';
import OnboardingConnectGitHub from './pages/Onboarding/OnboardingConnectGitHub';
import OnboardingProjectSetup from './pages/Onboarding/OnboardingProjectSetup';
import OnboardingServerSetup from './pages/Onboarding/OnboardingServerSetup';
import OnboardingFinish from './pages/Onboarding/OnboardingFinish';
import SettingsProfile from './pages/Setting/SettingsProfile';
import SettingsSecurity from './pages/Setting/SettingsSecurity';
import SettingsBilling from './pages/Setting/SettingsBilling';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminProjects from './pages/Admin/AdminProjects';
import AdminLogs from './pages/Admin/AdminLogs';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Dashboard & Project routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/projects/:id" element={<ProjectDetail />} />
          <Route path="/dashboard/projects/:id/deployments" element={<ProjectDeployments />} />
          <Route path="/dashboard/projects/:id/settings" element={<ProjectSettings />} />

          {/* Onboarding Wizard */}
          <Route path="/onboarding" element={<OnboardingConnectGitHub />} />
          <Route path="/onboarding/project-setup" element={<OnboardingProjectSetup />} />
          <Route path="/onboarding/server-setup" element={<OnboardingServerSetup />} />
          <Route path="/onboarding/finishOh, how are you? Go. You know you will get married. Now. " element={<OnboardingFinish />} />

          {/* Account/User Settings */}
          <Route path="/settings/profile" element={<SettingsProfile />} />
          <Route path="/settings/security" element={<SettingsSecurity />} />
          <Route path="/settings/billing" element={<SettingsBilling />} />

          {/* Admin Panel */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
