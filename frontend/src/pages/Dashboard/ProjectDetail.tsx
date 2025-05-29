import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  GitBranch, 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Download,
  ExternalLink,
  Terminal,
  Code,
  Rocket
} from 'lucide-react';

interface ProjectData {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: 'connected' | 'disconnected' | 'error';
  webhookUrl: string;
  lastDeployment: Date;
  deploymentCount: number;
  description: string;
}

interface Deployment {
  id: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  timestamp: Date;
  commit: string;
  commitMessage: string;
  author: string;
  duration: number;
  branch: string;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'deployments' | 'logs' | 'settings'>('overview');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setProject({
      id: id || '1',
      name: 'My Web App',
      repository: 'user/webapp',
      branch: 'main',
      status: 'connected',
      webhookUrl: 'https://api.auto-deploy-bot.com/webhook/abc123',
      lastDeployment: new Date('2025-05-29T10:30:00'),
      deploymentCount: 42,
      description: 'A modern web application built with React and Node.js'
    });

    setDeployments([
      {
        id: '1',
        status: 'success',
        timestamp: new Date('2025-05-29T10:30:00'),
        commit: 'a1b2c3d',
        commitMessage: 'Fix user authentication bug',
        author: 'john.doe',
        duration: 120,
        branch: 'main'
      },
      {
        id: '2',
        status: 'failed',
        timestamp: new Date('2025-05-29T08:15:00'),
        commit: 'e4f5g6h',
        commitMessage: 'Update dependencies',
        author: 'jane.smith',
        duration: 45,
        branch: 'main'
      },
      {
        id: '3',
        status: 'success',
        timestamp: new Date('2025-05-28T16:45:00'),
        commit: 'i7j8k9l',
        commitMessage: 'Add new feature',
        author: 'john.doe',
        duration: 180,
        branch: 'main'
      }
    ]);

    setLogs([
      '[2025-05-29 10:30:00] Starting deployment...',
      '[2025-05-29 10:30:05] Pulling latest changes from main branch',
      '[2025-05-29 10:30:10] Installing dependencies...',
      '[2025-05-29 10:30:45] Building application...',
      '[2025-05-29 10:31:30] Running tests...',
      '[2025-05-29 10:31:45] All tests passed ✓',
      '[2025-05-29 10:32:00] Deployment completed successfully ✓'
    ]);
  }, [id]);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'running':
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return "badge-success";
      case 'failed':
      case 'error':
        return "badge-error";
      case 'running':
      case 'pending':
        return "badge-warning";
      default:
        return "badge-info";
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false);
      // Add new deployment to list
      const newDeployment: Deployment = {
        id: Date.now().toString(),
        status: 'success',
        timestamp: new Date(),
        commit: 'new123',
        commitMessage: 'Manual deployment',
        author: 'current.user',
        duration: 95,
        branch: project?.branch || 'main'
      };
      setDeployments([newDeployment, ...deployments]);
    }, 3000);
  };  if (!project) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
        <div className="grid-bg absolute inset-0"></div>
        {/* Floating orbs */}
        <div className="floating-orb bg-primary-500/20"></div>
        <div className="floating-orb bg-accent-500/20" style={{ animationDelay: '2s' }}></div>
        <div className="floating-orb bg-electric-500/20" style={{ animationDelay: '4s' }}></div>
        <div className="relative z-10 text-white glow-text flex items-center">
          <RefreshCw className="h-6 w-6 mr-3 animate-spin text-primary-400" />
          Loading project details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="grid-bg absolute inset-0"></div>
      
      {/* Floating orbs */}
      <div className="floating-orb bg-primary-500/10"></div>
      <div className="floating-orb bg-accent-500/10" style={{ animationDelay: '3s' }}></div>
      <div className="floating-orb bg-electric-500/10" style={{ animationDelay: '6s' }}></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4 p-2 rounded-lg hover:bg-white/10 transition-colors group">
                <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold glow-text text-white">{project.name}</h1>
                <p className="text-gray-400 flex items-center">
                  <GitBranch className="h-4 w-4 mr-2" />
                  {project.repository}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`badge ${getStatusBadge(project.status)}`}>
                {getStatusIcon(project.status)}
                <span className="ml-2">{project.status}</span>
              </span>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="btn-primary flex items-center"
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Deploy Now
                  </>
                )}
              </button>
              <Link to={`/dashboard/project/${id}/settings`} className="btn-outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </div>
          </div>
        </div>
      </header>      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-white/10 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'deployments', label: 'Deployments', icon: GitBranch },
              { id: 'logs', label: 'Logs', icon: Terminal },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-primary-400 text-primary-400 glow-text'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Project Info */}
              <div className="card-glow p-6">
                <h2 className="text-lg font-semibold text-white mb-4 glow-text">Project Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Repository</p>
                    <p className="text-sm text-white flex items-center hover:text-primary-400 transition-colors">
                      {project.repository}
                      <ExternalLink className="h-4 w-4 ml-2 text-gray-400 hover:text-primary-400 transition-colors cursor-pointer" />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Branch</p>
                    <p className="text-sm text-white flex items-center">
                      <GitBranch className="h-4 w-4 mr-2 text-primary-400" />
                      {project.branch}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Total Deployments</p>
                    <p className="text-sm text-white font-bold text-primary-400">{project.deploymentCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">Last Deployment</p>
                    <p className="text-sm text-white">{formatTimeAgo(project.lastDeployment)}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-400">Description</p>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
              </div>

              {/* Recent Deployments */}
              <div className="card-glow">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white glow-text">Recent Deployments</h2>
                </div>
                <div className="divide-y divide-white/10">
                  {deployments.slice(0, 5).map((deployment) => (
                    <div key={deployment.id} className="p-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(deployment.status)}
                          <div className="ml-3">
                            <h3 className="font-medium text-white">
                              {deployment.commitMessage}
                            </h3>
                            <p className="text-sm text-gray-400">
                              <span className="bg-dark-700 px-2 py-1 rounded text-xs font-mono mr-2">
                                {deployment.commit}
                              </span>
                              {deployment.author} • {formatDuration(deployment.duration)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${getStatusBadge(deployment.status)}`}>
                            {deployment.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(deployment.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-white/10">
                  <button
                    onClick={() => setActiveTab('deployments')}
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium glow-text transition-colors"
                  >
                    View all deployments →
                  </button>
                </div>
              </div>
            </div>            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card-glow p-6">
                <h2 className="text-lg font-semibold text-white mb-4 glow-text">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Deploy Latest
                      </>
                    )}
                  </button>
                  <button className="w-full btn-outline flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Logs
                  </button>
                  <Link to={`/dashboard/project/${id}/settings`} className="w-full btn-outline flex items-center justify-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Project Settings
                  </Link>
                </div>
              </div>

              {/* Webhook Info */}
              <div className="card-glow p-6">
                <h2 className="text-lg font-semibold text-white mb-4 glow-text">Webhook Configuration</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Webhook URL</p>
                    <div className="mt-1 flex items-center">
                      <input
                        type="text"
                        value={project.webhookUrl}
                        readOnly
                        className="input-field text-xs flex-1 bg-dark-700/50 border-white/10"
                      />
                      <button className="ml-2 p-2 text-gray-400 hover:text-primary-400 transition-colors">
                        <Code className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Add this webhook URL to your GitHub repository settings to enable automatic deployments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}        {/* Deployments Tab */}
        {activeTab === 'deployments' && (
          <div className="card-glow">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white glow-text">All Deployments</h2>
            </div>
            <div className="divide-y divide-white/10">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="p-6 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(deployment.status)}
                      <div className="ml-3">
                        <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                          {deployment.commitMessage}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center">
                          <span className="bg-dark-700 px-2 py-1 rounded text-xs font-mono mr-2">
                            {deployment.commit}
                          </span>
                          <GitBranch className="h-3 w-3 mr-1" />
                          {deployment.branch} • {deployment.author}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${getStatusBadge(deployment.status)}`}>
                        {deployment.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(deployment.timestamp)} • {formatDuration(deployment.duration)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="card-glow">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white glow-text flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-primary-400" />
                Deployment Logs
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-dark-900/80 border border-white/10 text-gray-100 p-4 rounded-lg font-mono text-sm backdrop-blur-sm">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1 hover:bg-white/5 px-2 py-1 rounded transition-colors">
                    <span className="text-gray-500 mr-2">{String(index + 1).padStart(2, '0')}:</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card-glow p-6">
              <h2 className="text-lg font-semibold text-white mb-4 glow-text">Project Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    className="input-field bg-dark-700/50 border-white/10 text-white"
                    onChange={() => {}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Default Branch
                  </label>
                  <input
                    type="text"
                    value={project.branch}
                    className="input-field bg-dark-700/50 border-white/10 text-white"
                    onChange={() => {}}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={project.description}
                    rows={3}
                    className="input-field bg-dark-700/50 border-white/10 text-white"
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button className="btn-primary">Save Changes</button>
                <button className="btn-outline">Cancel</button>
              </div>
            </div>

            <div className="card-glow p-6 border border-red-500/20">
              <h2 className="text-lg font-semibold text-white mb-4 glow-text text-red-400">Danger Zone</h2>
              <div className="border border-red-500/30 bg-red-900/20 rounded-lg p-4">
                <h3 className="text-red-400 font-medium mb-2">Delete Project</h3>
                <p className="text-red-300 text-sm mb-4">
                  Once you delete a project, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors glow-on-hover">
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
