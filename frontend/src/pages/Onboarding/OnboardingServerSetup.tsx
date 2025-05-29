import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Server, Copy, Check, Terminal, Key, Download, Shield, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

const OnboardingServerSetup = () => {
  const [apiToken] = useState('adb_live_sk_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz');
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedOS, setSelectedOS] = useState('linux');
  const [isAgentInstalled, setIsAgentInstalled] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestConnection = () => {
    setAgentStatus('connecting');
    setTimeout(() => {
      setAgentStatus('connected');
    }, 3000);
  };

  const installCommands = {
    linux: {
      install: 'curl -fsSL https://deploy-bot.com/install.sh | bash',
      configure: `auto-deploy-bot configure --token=${apiToken}`,
      start: 'auto-deploy-bot start --daemon'
    },
    windows: {
      install: 'powershell -c "iwr https://deploy-bot.com/install.ps1 | iex"',
      configure: `auto-deploy-bot configure --token=${apiToken}`,
      start: 'auto-deploy-bot start --service'
    },
    macos: {
      install: 'curl -fsSL https://deploy-bot.com/install.sh | bash',
      configure: `auto-deploy-bot configure --token=${apiToken}`,
      start: 'auto-deploy-bot start --daemon'
    },
    docker: {
      install: `docker run -d --name auto-deploy-bot \\
  -e ADB_TOKEN=${apiToken} \\
  -v /var/run/docker.sock:/var/run/docker.sock \\
  -v \${PWD}:/workspace \\
  auto-deploy-bot/agent:latest`,
      configure: '# Configuration is handled via environment variables',
      start: '# Container starts automatically'
    }
  };

  const osOptions = [
    { id: 'linux', name: 'Linux', icon: '🐧' },
    { id: 'windows', name: 'Windows', icon: '🪟' },
    { id: 'macos', name: 'macOS', icon: '🍎' },
    { id: 'docker', name: 'Docker', icon: '🐳' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Install Server Agent</h1>
              <p className="text-gray-600 mt-1">Step 3 of 4 - Set up the deployment agent on your server</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600">Connect GitHub</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-green-600">Project Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">3</div>
                <span className="text-sm font-medium text-blue-600">Server Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">4</div>
                <span className="text-sm text-gray-500">Finish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Installation Instructions */}
          <div className="space-y-6">
            {/* API Token */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Key className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">API Token</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                Your unique API token for authenticating the server agent. Keep this secure!
              </p>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={apiToken}
                  readOnly
                  className="input-field flex-1 bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => handleCopy(apiToken, 'token')}
                  className="btn-outline px-3 py-2"
                >
                  {copied === 'token' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Keep Your Token Secure</h4>
                    <p className="text-sm text-yellow-700">
                      This token allows access to your deployment system. Never share it publicly or commit it to version control.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating System Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Your Server Environment</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {osOptions.map((os) => (
                  <div
                    key={os.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedOS === os.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedOS(os.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{os.icon}</span>
                      <span className="font-medium text-gray-900">{os.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation Commands */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Terminal className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Installation Commands</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Run these commands on your server to install and configure the Auto Deploy Bot agent.
              </p>

              <div className="space-y-4">
                {/* Step 1: Install */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">1. Install Agent</h4>
                    <button
                      onClick={() => handleCopy(installCommands[selectedOS as keyof typeof installCommands].install, 'install')}
                      className="btn-outline px-2 py-1 text-xs"
                    >
                      {copied === 'install' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {installCommands[selectedOS as keyof typeof installCommands].install}
                  </div>
                </div>

                {/* Step 2: Configure */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">2. Configure with Token</h4>
                    <button
                      onClick={() => handleCopy(installCommands[selectedOS as keyof typeof installCommands].configure, 'configure')}
                      className="btn-outline px-2 py-1 text-xs"
                    >
                      {copied === 'configure' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {installCommands[selectedOS as keyof typeof installCommands].configure}
                  </div>
                </div>

                {/* Step 3: Start */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">3. Start Agent</h4>
                    <button
                      onClick={() => handleCopy(installCommands[selectedOS as keyof typeof installCommands].start, 'start')}
                      className="btn-outline px-2 py-1 text-xs"
                    >
                      {copied === 'start' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    {installCommands[selectedOS as keyof typeof installCommands].start}
                  </div>
                </div>
              </div>

              {selectedOS === 'docker' && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Docker Requirements</h4>
                      <p className="text-sm text-blue-700">
                        Make sure Docker is installed and the current user has permission to access the Docker socket.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Troubleshooting */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <a
                  href="https://docs.deploy-bot.com/installation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Installation Documentation</span>
                </a>
                <a
                  href="https://docs.deploy-bot.com/troubleshooting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Troubleshooting Guide</span>
                </a>
                <a
                  href="mailto:support@deploy-bot.com"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Connection Status */}
          <div className="space-y-6">
            {/* Agent Status */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Agent Connection</h3>
              </div>

              <div className="text-center py-8">
                {agentStatus === 'disconnected' && (
                  <div>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Server className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Waiting for Connection</h4>
                    <p className="text-gray-600 mb-6">
                      Install and start the agent on your server to establish connection.
                    </p>
                    <button
                      onClick={handleTestConnection}
                      className="btn-outline"
                    >
                      Test Connection
                    </button>
                  </div>
                )}

                {agentStatus === 'connecting' && (
                  <div>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Connecting...</h4>
                    <p className="text-gray-600">
                      Establishing secure connection with your server.
                    </p>
                  </div>
                )}

                {agentStatus === 'connected' && (
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Connected!</h4>
                    <p className="text-gray-600 mb-6">
                      Your server agent is successfully connected and ready for deployments.
                    </p>
                    <div className="text-left bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Server OS:</span>
                          <div className="font-medium">Ubuntu 22.04 LTS</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Agent Version:</span>
                          <div className="font-medium">v1.2.3</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Ping:</span>
                          <div className="font-medium text-green-600">Just now</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Uptime:</span>
                          <div className="font-medium">2 minutes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* System Requirements */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">System Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Memory (RAM)</span>
                  <span className="font-medium text-green-600">512MB minimum</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Disk Space</span>
                  <span className="font-medium text-green-600">1GB available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Network</span>
                  <span className="font-medium text-green-600">Outbound HTTPS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Node.js</span>
                  <span className="font-medium text-green-600">v16+ (optional)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Docker</span>
                  <span className="font-medium text-green-600">v20+ (optional)</span>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Security Features</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">End-to-End Encryption</div>
                    <div className="text-sm text-gray-600">All communications use TLS 1.3</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Token-Based Auth</div>
                    <div className="text-sm text-gray-600">Secure API token authentication</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Minimal Permissions</div>
                    <div className="text-sm text-gray-600">Agent runs with limited system access</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button className="btn-outline inline-flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Project Setup</span>
          </button>
          
          <button
            className="btn-primary"
            disabled={agentStatus !== 'connected'}
          >
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingServerSetup;
