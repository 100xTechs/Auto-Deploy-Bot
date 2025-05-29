import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  GitBranch, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Activity,
  Server,
  Users,
  Zap,
  Sparkles,
  Rocket,
  Shield
} from 'lucide-react';
interface Project {
  id: string;
  name: string;
  repository: string;
  status: 'connected' | 'disconnected' | 'error';
  lastDeployment: Date;
  deploymentCount: number;
  branch: string;
}

interface Deployment {
  id: string;
  projectName: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  timestamp: Date;
  commit: string;
  branch: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'My Web App',
      repository: 'user/webapp',
      status: 'connected',
      lastDeployment: new Date('2025-05-28T14:30:00'),
      deploymentCount: 42,
      branch: 'main'
    },
    {
      id: '2',
      name: 'API Service',
      repository: 'user/api-service',
      status: 'connected',
      lastDeployment: new Date('2025-05-29T09:15:00'),
      deploymentCount: 28,
      branch: 'production'
    },
    {
      id: '3',
      name: 'Frontend Dashboard',
      repository: 'user/dashboard',
      status: 'error',
      lastDeployment: new Date('2025-05-27T16:45:00'),
      deploymentCount: 15,
      branch: 'main'
    }
  ]);

  const [recentDeployments, setRecentDeployments] = useState<Deployment[]>([
    {
      id: '1',
      projectName: 'My Web App',
      status: 'success',
      timestamp: new Date('2025-05-29T10:30:00'),
      commit: 'a1b2c3d',
      branch: 'main'
    },
    {
      id: '2',
      projectName: 'API Service',
      status: 'running',
      timestamp: new Date('2025-05-29T09:15:00'),
      commit: 'e4f5g6h',
      branch: 'production'
    },
    {
      id: '3',
      projectName: 'Frontend Dashboard',
      status: 'failed',
      timestamp: new Date('2025-05-28T18:20:00'),
      commit: 'i7j8k9l',
      branch: 'main'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'running':
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
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
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950"></div>
      <div className="grid-bg absolute inset-0"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>      {/* Header */}
      <header className="sticky top-0 z-10">
        <div className="glass-dark backdrop-blur-strong border-b border-slate-700/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-black text-white text-shadow tracking-tight">Dashboard</h1>
                <p className="text-slate-300 font-medium">Enterprise deployment command center</p>
              </div>
              <Link 
                to="/onboarding" 
                className="btn-primary flex items-center border-glow group"
              >
                <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                New Project
              </Link>
            </div>
          </div>
        </div>
      </header><div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-glow p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Active Projects</p>
                <p className="text-2xl font-bold text-white text-shadow">{projects.length}</p>
              </div>
            </div>
          </div>          <div className="card-glow p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Successful Deployments</p>
                <p className="text-2xl font-bold text-white text-shadow">127</p>
              </div>
            </div>
          </div>

          <div className="card-glow p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-white text-shadow">43</p>
              </div>
            </div>
          </div>

          <div className="card-glow p-6 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Avg Deploy Time</p>
                <p className="text-2xl font-bold text-white text-shadow">2.4m</p>
              </div>
            </div>
          </div>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects */}
          <div className="card-glow">
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center text-shadow">
                  <Rocket className="h-5 w-5 mr-2 text-indigo-400" />
                  Your Projects
                </h2>
                <Link to="/onboarding" className="btn-secondary text-sm">
                  Add Project
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-700/50">
              {projects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GitBranch className="h-5 w-5 text-slate-400 mr-3 group-hover:text-indigo-400 transition-colors" />
                      <div>
                        <h3 className="font-medium text-white">
                          <Link 
                            to={`/dashboard/project/${project.id}`}
                            className="hover:text-indigo-400 transition-colors"
                          >
                            {project.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-slate-400">{project.repository}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        {getStatusIcon(project.status)}
                        <span className={`ml-2 text-sm ${getStatusBadge(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {formatTimeAgo(project.lastDeployment)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                    <span className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Branch: {project.branch}
                    </span>
                    <span className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      {project.deploymentCount} deployments
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="card-glow">
            <div className="p-6 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white flex items-center text-shadow">
                <Activity className="h-5 w-5 mr-2 text-purple-400" />
                Recent Deployments
              </h2>
            </div>
            <div className="divide-y divide-slate-700/50">
              {recentDeployments.map((deployment) => (
                <div key={deployment.id} className="p-6 hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(deployment.status)}
                      <div className="ml-3">
                        <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">
                          {deployment.projectName}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {deployment.branch} • {deployment.commit}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={getStatusBadge(deployment.status)}>
                        {deployment.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTimeAgo(deployment.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-700/50">
              <Link 
                to="/dashboard/deployments" 
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center transition-colors"
              >
                View all deployments 
                <Sparkles className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card-glow p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center text-shadow">
              <Sparkles className="h-5 w-5 mr-2 text-indigo-400" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                to="/onboarding"
                className="card p-6 border-2 border-dashed border-slate-600 hover:border-indigo-400 hover:bg-indigo-500/10 transition-all duration-300 text-center group"
              >
                <Plus className="h-8 w-8 text-slate-400 group-hover:text-indigo-400 mx-auto mb-3 transition-colors" />
                <h3 className="font-medium text-white group-hover:text-indigo-400 transition-colors">Add New Project</h3>
                <p className="text-sm text-slate-400">Connect a GitHub repository</p>
              </Link>

              <Link 
                to="/settings/profile"
                className="card p-6 border-2 border-dashed border-slate-600 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 text-center group"
              >
                <Users className="h-8 w-8 text-slate-400 group-hover:text-purple-400 mx-auto mb-3 transition-colors" />
                <h3 className="font-medium text-white group-hover:text-purple-400 transition-colors">Team Settings</h3>
                <p className="text-sm text-slate-400">Manage team members</p>
              </Link>

              <Link 
                to="/settings/billing"
                className="card p-6 border-2 border-dashed border-slate-600 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 text-center group"
              >
                <Activity className="h-8 w-8 text-slate-400 group-hover:text-cyan-400 mx-auto mb-3 transition-colors" />
                <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors">View Analytics</h3>
                <p className="text-sm text-slate-400">Deployment metrics</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
