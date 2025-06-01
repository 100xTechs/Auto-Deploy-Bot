import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, CheckCircle, ArrowRight, Shield, Users, Zap, Search, Star, GitFork, Calendar, ChevronDown, Lock, Globe } from 'lucide-react';
import axios from 'axios';
import type { GitHubUser, GitHubRepository } from '../../utilities/types';
import { BACKEND_URL } from '../../utilities/globle';



const OnboardingConnectGitHub = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'stars' | 'updated' | 'created'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 8;

  // Fetch repositories from GitHub API
  const fetchRepositories = async (username: string) => {
    setIsLoadingRepos(true);
    try {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          type: 'all', // Get both public and private repos
          sort: 'updated',
          per_page: 100, // Get more repos
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('github_access_token')}`,
        }
      });
      setRepositories(response.data);
      console.log("Repositories fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  useEffect(() => {
    // http://localhost:5173/onboarding?code=46e99bed494fdff036da
    const params = new URLSearchParams(window.location.search);
    const codeParams = params.get('code');

    if (codeParams && (localStorage.getItem('github_access_token')) === null) {
      const getAccessToken = async (code: string) => {
        try {
          const response = await axios.get(`${BACKEND_URL}/github/getAccessToken?code=${code}`);
          if (response.data.access_token) {
            localStorage.setItem('github_access_token', response.data.access_token);
            console.log("Access token stored successfully:", response.data.access_token);

            // Trigger re-fetch of user data
            window.location.reload();
          } else {
            console.error("Failed to get access token");
          }
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      };
      getAccessToken(codeParams);
    }

    if(localStorage.getItem('github_access_token')) {
      const getUserData = async () => {
        try {
          const response = await axios.get(`${BACKEND_URL}/github/getUserData`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('github_access_token')}`
            }
          });
          setUser(response.data);
          setIsConnected(true);
          console.log("User data fetched successfully:", response.data);
          
          // Fetch repositories after getting user data
          if (response.data.login) {
            await fetchRepositories(response.data.login);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      getUserData()
    }

    setIsConnecting(false)

  }, [])

  const handleConnectGitHub = async () => {
    setIsConnecting(true);

    // Simulate GitHub OAuth flow
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + import.meta.env.VITE_GITHUB_CLIENT_ID + "&scope=repo,user");

    setIsConnecting(false);
  };  const handleRepoSelect = (repoName: string) => {
    setSelectedRepo(repoName === selectedRepo ? '' : repoName);
  };

  // Filter and sort repositories
  const filteredAndSortedRepos = useMemo(() => {
    let filtered = repositories.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (repo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'public' && !repo.private) ||
                           (filterType === 'private' && repo.private);
      
      return matchesSearch && matchesFilter;
    });

    // Sort repositories
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'stars':
          comparison = a.stargazers_count - b.stargazers_count;
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [repositories, searchTerm, filterType, sortBy, sortOrder]);

  // Paginate repositories
  const paginatedRepos = useMemo(() => {
    const startIndex = (currentPage - 1) * reposPerPage;
    return filteredAndSortedRepos.slice(startIndex, startIndex + reposPerPage);
  }, [filteredAndSortedRepos, currentPage, reposPerPage]);

  const totalPages = Math.ceil(filteredAndSortedRepos.length / reposPerPage);  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleContinueToProjectSetup = () => {
    if (selectedRepo) {
      // Store selected repo in localStorage for next step
      localStorage.setItem('selectedRepo', selectedRepo);
      navigate('/onboarding/project-setup');
    }
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      <div className="grid-bg absolute inset-0"></div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-float"></div>

      {/* Header */}
      <div className="relative z-10 glass-dark border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white glow-text">Connect Your GitHub Account</h1>
              <p className="text-gray-300 mt-1">Step 1 of 4 - Grant access to your repositories</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-primary-500/30">1</div>
                <span className="text-sm font-medium text-primary-400">Connect GitHub</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-medium">2</div>
                <span className="text-sm text-gray-400">Project Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-medium">3</div>
                <span className="text-sm text-gray-400">Server Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm font-medium">4</div>
                <span className="text-sm text-gray-400">Finish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto px-4 py-8 w-full">        {!isConnected ? (
        <div className="max-w-2xl mx-auto">
          {/* GitHub Connection Card */}
          <div className="card-glow p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Github className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 glow-text">Connect to GitHub</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              To get started, we need to connect to your GitHub account to access your repositories and set up deployment workflows.
            </p>

            <button
              onClick={handleConnectGitHub}
              disabled={isConnecting}
              className="btn-primary inline-flex items-center space-x-2 mb-8"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  <span>Connect with GitHub</span>
                </>
              )}
            </button>              {/* Security Notice */}
            <div className="card p-4 text-left">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-primary-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-white mb-1">Secure Connection</h3>
                  <p className="text-sm text-gray-300">
                    We use OAuth 2.0 for secure authentication. We only request the minimum permissions needed to deploy your applications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="text-center card-glow p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-emerald-400 transition-colors">Secure Access</h3>
              <p className="text-sm text-gray-300">
                Your code stays secure with read-only access and encrypted connections.
              </p>
            </div>

            <div className="text-center card-glow p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-primary-400 transition-colors">Team Collaboration</h3>
              <p className="text-sm text-gray-300">
                Invite team members and manage deployments together.
              </p>
            </div>

            <div className="text-center card-glow p-6 group hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">Auto Deploy</h3>
              <p className="text-sm text-gray-300">
                Automatic deployments triggered by git pushes or manual releases.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Connected State */}
          <div className="card-glow p-6 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-white glow-text">GitHub Connected Successfully!</h2>
                <p className="text-gray-300">Welcome, {user?.name}!</p>
              </div>
            </div>            <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <img src={user?.avatar_url} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-primary-500/50" />
              <div className="flex-1">
                <div className="font-medium text-white">@{user?.login}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>{user?.public_repos} repos</span>
                    <span>{user?.followers} followers</span>
                    <span>{user?.following} following</span>
                  </div>
                </div>
              </div>
            </div>
          </div>          {/* Repository Selection */}
          <div className="card-glow p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3 glow-text">Choose Your Repository</h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Select one repository to get started with automated deployments. You can add more repositories later from your dashboard.
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gray-800/30 rounded-xl p-6 mb-8 border border-gray-700/50">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-500 transition-all duration-300 text-sm font-medium"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex gap-3">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'public' | 'private')}
                      className="appearance-none bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-500 transition-all duration-300 min-w-[140px] text-sm font-medium"
                    >
                      <option value="all">All Repos</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort as 'name' | 'stars' | 'updated' | 'created');
                        setSortOrder(order as 'asc' | 'desc');
                      }}
                      className="appearance-none bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-500 transition-all duration-300 min-w-[160px] text-sm font-medium"
                    >
                      <option value="updated-desc">Recently Updated</option>
                      <option value="created-desc">Recently Created</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="stars-desc">Most Stars</option>
                      <option value="stars-asc">Least Stars</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Search Results Summary */}
              {searchTerm && (
                <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                  <p className="text-sm text-primary-300 font-medium">
                    Found {filteredAndSortedRepos.length} repositories matching "{searchTerm}"
                  </p>
                </div>
              )}
            </div>            {/* Repository List */}
            {isLoadingRepos ? (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 w-12 h-12 border-4 border-primary-400/10 border-t-primary-400 rounded-full animate-spin animate-reverse"></div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Loading Your Repositories</h4>
                <p className="text-gray-400 text-center max-w-md">
                  We're fetching your repositories from GitHub. This might take a moment...
                </p>
              </div>
            ) : paginatedRepos.length === 0 ? (
              <div className="text-center py-20 bg-gray-800/20 rounded-xl border border-gray-700/50">
                <Github className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                <h4 className="text-lg font-semibold text-white mb-2">No Repositories Found</h4>
                <p className="text-gray-400 max-w-md mx-auto">
                  {searchTerm 
                    ? `No repositories match "${searchTerm}". Try adjusting your search or filters.`
                    : "You don't have any repositories yet. Create one on GitHub to get started!"
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Repository Grid */}
                <div className="grid gap-4 mb-8">
                  {paginatedRepos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => handleRepoSelect(repo.name)}
                      className={`group relative cursor-pointer transition-all duration-300 ${
                        selectedRepo === repo.name
                          ? 'transform scale-[1.02]'
                          : 'hover:transform hover:scale-[1.01]'
                      }`}
                    >
                      <div
                        className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                          selectedRepo === repo.name
                            ? 'border-primary-400 bg-primary-500/10 shadow-lg shadow-primary-500/25 ring-1 ring-primary-400/50'
                            : 'border-gray-600/50 bg-gray-800/30 hover:border-primary-500/50 hover:bg-gray-800/50 hover:shadow-md hover:shadow-primary-500/10'
                        }`}
                      >
                        {/* Selection Indicator */}
                        <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedRepo === repo.name
                            ? 'border-primary-400 bg-primary-500 shadow-lg shadow-primary-500/50'
                            : 'border-gray-500 bg-gray-800 group-hover:border-primary-400'
                        }`}>
                          {selectedRepo === repo.name && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Repository Header */}
                        <div className="mb-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Github className={`h-6 w-6 ${
                              selectedRepo === repo.name ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'
                            } transition-colors duration-300`} />
                            <h3 className={`text-xl font-bold ${
                              selectedRepo === repo.name ? 'text-white' : 'text-gray-200 group-hover:text-white'
                            } transition-colors duration-300`}>
                              {repo.name}
                            </h3>
                            {repo.private ? (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg">
                                <Lock className="h-3 w-3 text-amber-400" />
                                <span className="text-xs font-medium text-amber-300">Private</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                                <Globe className="h-3 w-3 text-emerald-400" />
                                <span className="text-xs font-medium text-emerald-300">Public</span>
                              </div>
                            )}
                          </div>
                          
                          {repo.description && (
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                        </div>

                        {/* Repository Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            {repo.language && (
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                                <span className="text-sm text-gray-300 font-medium">{repo.language}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1 text-gray-400">
                              <Star className="h-4 w-4" />
                              <span className="text-sm font-medium">{repo.stargazers_count}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-gray-400">
                              <GitFork className="h-4 w-4" />
                              <span className="text-sm font-medium">{repo.forks_count}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Updated {formatDate(repo.updated_at)}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                          selectedRepo === repo.name 
                            ? 'bg-primary-500/5 opacity-100' 
                            : 'bg-primary-500/5 opacity-0 group-hover:opacity-100'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>) : ({

                
                    paginatedRepos.map((repo) => (
                      <div
                        key={repo.id}
                        className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-lg ${
                          selectedRepo.includes(repo.name)
                            ? 'border-primary-400 bg-primary-500/10 shadow-lg shadow-primary-500/20 ring-1 ring-primary-400/50'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-800/30 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedRepo.includes(repo.name)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRepoSelect(repo.name);
                              }}
                              className="h-4 w-4 text-primary-500 rounded border-gray-500 bg-gray-700 focus:ring-primary-500 focus:ring-2 mt-1 cursor-pointer"
                            />
                            <div 
                              className="flex-1 cursor-pointer"
                              onClick={() => handleRepoSelect(repo.name)}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-white text-lg hover:text-primary-300 transition-colors">{repo.name}</span>
                                {repo.private ? (
                                  <div className="flex items-center space-x-1">
                                    <Lock className="h-4 w-4 text-yellow-400" />
                                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">Private</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1">
                                    <Globe className="h-4 w-4 text-emerald-400" />
                                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Public</span>
                                  </div>
                                )}
                                {repo.archived && (
                                  <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded">
                                    Archived
                                  </span>
                                )}
                              </div>                              
                              {repo.description && (
                                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{repo.description}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-400">
                                {repo.language && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                                    <span className="font-medium">{repo.language}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                                  <Star className="h-3 w-3" />
                                  <span>{repo.stargazers_count.toLocaleString()}</span>
                                </div>
                                
                                <div className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                                  <GitFork className="h-3 w-3" />
                                  <span>{repo.forks_count.toLocaleString()}</span>
                                </div>
                                
                                <div className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                                  <Calendar className="h-3 w-3" />
                                  <span>Updated {formatDate(repo.updated_at)}</span>
                                </div>
                              </div>
                              
                              {repo.topics && repo.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {repo.topics.slice(0, 3).map((topic) => (
                                    <span
                                      key={topic}
                                      className="px-2 py-1 text-xs bg-primary-500/20 text-primary-300 rounded hover:bg-primary-500/30 transition-colors"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                  {repo.topics.length > 3 && (
                                    <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded hover:bg-gray-500 transition-colors">
                                      +{repo.topics.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                )               {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <div className="text-sm text-gray-400">
                      Showing {((currentPage - 1) * reposPerPage) + 1} to {Math.min(currentPage * reposPerPage, filteredAndSortedRepos.length)} of {filteredAndSortedRepos.length} repositories
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 text-white rounded-lg hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:border-gray-600 transition-all duration-200"
                      >
                        Previous
                      </button>
                      <div className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-800/30 border border-gray-600 rounded-lg">
                        <span className="font-medium">{currentPage}</span>
                        <span className="mx-1 text-gray-500">of</span>
                        <span className="font-medium">{totalPages}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(prev => Math.min(prev + 1, totalPages));
                        }}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm bg-gray-800/50 border border-gray-600 text-white rounded-lg hover:bg-gray-700 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800/50 disabled:hover:border-gray-600 transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}            {/* Summary and Continue Button */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
             
              <button
                onClick={handleContinueToProjectSetup}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center space-x-2"
                disabled={selectedRepo.length === 0}
              >
                <span>Continue to Project Setup</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default OnboardingConnectGitHub;
