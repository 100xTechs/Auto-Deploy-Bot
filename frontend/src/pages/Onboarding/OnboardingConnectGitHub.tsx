import React, { useState } from 'react';
import { Github, CheckCircle, AlertCircle, ArrowRight, Shield, Users, Zap, Sparkles, Rocket } from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

const OnboardingConnectGitHub = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);

  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    
    // Simulate GitHub OAuth flow
    setTimeout(() => {
      setUser({
        login: 'johndoe',
        name: 'John Doe',
        avatar_url: 'https://via.placeholder.com/40',
        email: 'john@example.com'
      });
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const repositories = [
    { name: 'my-web-app', full_name: 'johndoe/my-web-app', description: 'React web application', private: false },
    { name: 'api-backend', full_name: 'johndoe/api-backend', description: 'Node.js API server', private: true },
    { name: 'mobile-app', full_name: 'johndoe/mobile-app', description: 'React Native mobile app', private: false },
    { name: 'documentation', full_name: 'johndoe/documentation', description: 'Project documentation', private: false },
  ];

  const handleRepoSelect = (repoName: string) => {
    setSelectedRepos(prev => 
      prev.includes(repoName) 
        ? prev.filter(name => name !== repoName)
        : [...prev, repoName]
    );
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
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <img src={user?.avatar_url} alt={user?.name} className="w-12 h-12 rounded-full border-2 border-primary-500/50" />
                <div>
                  <div className="font-medium text-white">@{user?.login}</div>
                  <div className="text-sm text-gray-400">{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Repository Selection */}
            <div className="card-glow p-6">
              <h3 className="text-lg font-bold text-white mb-4 glow-text">Select Repositories</h3>
              <p className="text-gray-300 mb-6">
                Choose which repositories you'd like to set up for deployment. You can add more later.
              </p>

              <div className="space-y-3 mb-6">
                {repositories.map((repo) => (
                  <div
                    key={repo.full_name}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedRepos.includes(repo.name)
                        ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                        : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                    }`}                    onClick={() => handleRepoSelect(repo.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedRepos.includes(repo.name)}
                          onChange={() => handleRepoSelect(repo.name)}
                          className="h-4 w-4 text-primary-500 rounded border-gray-500 bg-gray-700 focus:ring-primary-500"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{repo.name}</span>
                            {repo.private && (
                              <span className="badge-info">
                                Private
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{repo.description}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {selectedRepos.length} repositories selected
                </div>
                <button
                  className="btn-primary"
                  disabled={selectedRepos.length === 0}
                >
                  Continue to Project Setup
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
