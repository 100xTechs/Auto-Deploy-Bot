import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  RotateCcw,
  GitBranch,
  User,
  Calendar,
  Search
} from 'lucide-react';

interface Deployment {
  id: string;
  status: 'success' | 'failed' | 'pending' | 'running' | 'cancelled';
  timestamp: Date;
  commit: string;
  commitMessage: string;
  author: string;
  duration: number;
  branch: string;
  environment: string;
  version: string;
  logs?: string[];
}

const ProjectDeployments = () => {
  const { id } = useParams();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [filteredDeployments, setFilteredDeployments] = useState<Deployment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockDeployments: Deployment[] = [
      {
        id: '1',
        status: 'success',
        timestamp: new Date('2025-05-29T10:30:00'),
        commit: 'a1b2c3d',
        commitMessage: 'Fix user authentication bug and improve error handling',
        author: 'john.doe',
        duration: 120,
        branch: 'main',
        environment: 'production',
        version: 'v1.2.3'
      },
      {
        id: '2',
        status: 'failed',
        timestamp: new Date('2025-05-29T08:15:00'),
        commit: 'e4f5g6h',
        commitMessage: 'Update dependencies to latest versions',
        author: 'jane.smith',
        duration: 45,
        branch: 'main',
        environment: 'production',
        version: 'v1.2.2'
      },
      {
        id: '3',
        status: 'success',
        timestamp: new Date('2025-05-28T16:45:00'),
        commit: 'i7j8k9l',
        commitMessage: 'Add new feature for user dashboard',
        author: 'john.doe',
        duration: 180,
        branch: 'feature/dashboard',
        environment: 'staging',
        version: 'v1.2.1'
      },
      {
        id: '4',
        status: 'running',
        timestamp: new Date('2025-05-29T11:00:00'),
        commit: 'm3n4o5p',
        commitMessage: 'Performance optimizations',
        author: 'alice.brown',
        duration: 0,
        branch: 'main',
        environment: 'production',
        version: 'v1.2.4'
      },
      {
        id: '5',
        status: 'cancelled',
        timestamp: new Date('2025-05-27T14:20:00'),
        commit: 'q6r7s8t',
        commitMessage: 'Hotfix for critical bug',
        author: 'bob.wilson',
        duration: 30,
        branch: 'hotfix/critical-bug',
        environment: 'production',
        version: 'v1.2.0'
      }
    ];
    setDeployments(mockDeployments);
    setFilteredDeployments(mockDeployments);
  }, [id]);

  useEffect(() => {
    let filtered = deployments;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(d => d.status === selectedStatus);
    }

    if (selectedBranch !== 'all') {
      filtered = filtered.filter(d => d.branch === selectedBranch);
    }

    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.commit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDeployments(filtered);
  }, [deployments, selectedStatus, selectedBranch, searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'running':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'pending':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleRollback = (deploymentId: string) => {
    console.log('Rollback to deployment:', deploymentId);
    // Implement rollback logic
  };

  const uniqueBranches = Array.from(new Set(deployments.map(d => d.branch)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link to={`/dashboard/project/${id}`} className="mr-4">
                <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Deployment History</h1>
                <p className="text-gray-600">View and manage all deployments</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-outline flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="btn-outline flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search commits, messages, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="running">Running</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="input-field"
              >
                <option value="all">All Branches</option>
                {uniqueBranches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedBranch('all');
                  setSearchQuery('');
                }}
                className="btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Deployments List */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Deployments ({filteredDeployments.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Filter className="h-4 w-4" />
                <span>Filtered results</span>
              </div>
            </div>
          </div>

          {filteredDeployments.length === 0 ? (
            <div className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deployments found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredDeployments.map((deployment) => (
                <div key={deployment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {getStatusIcon(deployment.status)}
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {deployment.commitMessage}
                          </h3>
                          <div className="flex items-center space-x-4">
                            <span className={getStatusBadge(deployment.status)}>
                              {deployment.status}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {}}
                                className="text-gray-400 hover:text-gray-600"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {deployment.status === 'success' && (
                                <button
                                  onClick={() => handleRollback(deployment.id)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Rollback"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <GitBranch className="h-4 w-4 mr-1" />
                            {deployment.branch}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {deployment.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatTimeAgo(deployment.timestamp)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDuration(deployment.duration)}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-4">
                            <span>Commit: {deployment.commit}</span>
                            <span>Version: {deployment.version}</span>
                            <span>Environment: {deployment.environment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredDeployments.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredDeployments.length}</span> of{' '}
              <span className="font-medium">{filteredDeployments.length}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn-outline">Previous</button>
              <button className="btn-outline">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDeployments;
