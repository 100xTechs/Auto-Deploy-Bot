import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { projectsState, deploymentsState } from '../store/atoms';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import AddProjectModal from '../components/modals/AddProjectModal';
import { apiService } from '../services/apiService';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useRecoilState(projectsState);
  const [deployments, setDeployments] = useRecoilState(deploymentsState);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };  const loadProjects = async () => {
    try {
      setProjects(prev => ({ ...prev, loading: true }));
      const response = await apiService.getProjects();
      setProjects(prev => ({ ...prev, projects: response.projects, loading: false }));
    } catch (error) {
      console.error('Failed to load projects:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load projects'
      });
      setProjects(prev => ({ ...prev, loading: false }));
    }
  };

  const loadDeployments = async () => {
    try {
      setDeployments(prev => ({ ...prev, loading: true }));
      const response = await apiService.getDeployments();
      setDeployments(prev => ({ ...prev, deployments: response.deployments, loading: false }));
    } catch (error) {
      console.error('Failed to load deployments:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load deployments'
      });
      setDeployments(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadProjects();
    loadDeployments();
  }, [setProjects, setDeployments]);

  const handleProjectAdded = () => {
    setAlert({ type: 'success', message: 'Project created successfully!' });
    setIsAddProjectModalOpen(false);
    loadProjects(); // Reload projects after adding
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auto Deploy Bot</h1>
              <p className="text-gray-600">Welcome back, {user?.username}</p>
            </div>
            <div className="flex space-x-4">              <Button
                variant="outline"
                onClick={() => setIsAddProjectModalOpen(true)}
              >
                New Project
              </Button>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {alert && (
            <div className="mb-6">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">{projects.projects.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Successful Deployments</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {deployments.deployments.filter(d => d.status === 'SUCCESS').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending Deployments</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {deployments.deployments.filter(d => d.status === 'PENDING').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Projects</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {projects.projects.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">No projects found. Create your first project to get started!</p>
                </div>
              ) : (
                projects.projects.map((project) => (                  <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                        <p className="text-sm text-gray-500">{project.githubRepo}</p>
                        <p className="text-xs text-gray-400">Branch: {project.githubBranch}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full text-blue-600 bg-blue-100">
                          Active
                        </span>
                        <Button size="sm" variant="outline">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Deployments</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {deployments.deployments.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500">No deployments yet.</p>
                </div>
              ) : (
                deployments.deployments.map((deployment) => (                  <div key={deployment.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {deployment.project?.name || 'Unknown Project'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Commit: {deployment.commitHash} • {deployment.deployedAt || deployment.createdAt}
                        </p>
                        {deployment.commitMsg && (
                          <p className="text-xs text-gray-400">{deployment.commitMsg}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>          </div>
        </div>
      </main>

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
};

export default Dashboard;
