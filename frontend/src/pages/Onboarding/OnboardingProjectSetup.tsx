import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Globe, Server, Database, Code, Copy, Check, Webhook, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

interface ProjectConfig {
  name: string;
  repository: string;
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  environmentVariables: { key: string; value: string }[];
  branch: string;
  nodeVersion: string;
}

const OnboardingProjectSetup = () => {
  const [selectedProject, setSelectedProject] = useState('my-web-app');
  const [config, setConfig] = useState<ProjectConfig>({
    name: 'My Web App',
    repository: 'johndoe/my-web-app',
    framework: 'react',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    environmentVariables: [
      { key: 'NODE_ENV', value: 'production' },
      { key: 'API_URL', value: '' }
    ],
    branch: 'main',
    nodeVersion: '18'
  });
  
  const [webhookUrl] = useState('https://deploy-bot.com/webhook/abc123def456');
  const [webhookSecret] = useState('wh_secret_xyz789abc123');
  const [copied, setCopied] = useState<string | null>(null);
  const [isWebhookConfigured, setIsWebhookConfigured] = useState(false);

  const repositories = [
    { name: 'my-web-app', full_name: 'johndoe/my-web-app', description: 'React web application' },
    { name: 'api-backend', full_name: 'johndoe/api-backend', description: 'Node.js API server' },
    { name: 'mobile-app', full_name: 'johndoe/mobile-app', description: 'React Native mobile app' },
  ];

  const frameworks = [
    { id: 'react', name: 'React', icon: '⚛️', buildCmd: 'npm run build', outputDir: 'build' },
    { id: 'vue', name: 'Vue.js', icon: '🟢', buildCmd: 'npm run build', outputDir: 'dist' },
    { id: 'angular', name: 'Angular', icon: '🔺', buildCmd: 'ng build', outputDir: 'dist' },
    { id: 'nextjs', name: 'Next.js', icon: '▲', buildCmd: 'npm run build', outputDir: '.next' },
    { id: 'vite', name: 'Vite', icon: '⚡', buildCmd: 'npm run build', outputDir: 'dist' },
    { id: 'static', name: 'Static HTML', icon: '📄', buildCmd: '', outputDir: '.' },
  ];

  const nodeVersions = ['16', '18', '20'];

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId);
    if (framework) {
      setConfig(prev => ({
        ...prev,
        framework: frameworkId,
        buildCommand: framework.buildCmd,
        outputDirectory: framework.outputDir
      }));
    }
  };

  const addEnvironmentVariable = () => {
    setConfig(prev => ({
      ...prev,
      environmentVariables: [...prev.environmentVariables, { key: '', value: '' }]
    }));
  };

  const updateEnvironmentVariable = (index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      environmentVariables: prev.environmentVariables.map((env, i) => 
        i === index ? { ...env, [field]: value } : env
      )
    }));
  };

  const removeEnvironmentVariable = (index: number) => {
    setConfig(prev => ({
      ...prev,
      environmentVariables: prev.environmentVariables.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configure Your Project</h1>
              <p className="text-gray-600 mt-1">Step 2 of 4 - Set up deployment configuration and webhooks</p>
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
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">2</div>
                <span className="text-sm font-medium text-blue-600">Project Setup</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center space-x-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">3</div>
                <span className="text-sm text-gray-500">Server Setup</span>
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
          {/* Left Column - Project Configuration */}
          <div className="space-y-6">
            {/* Repository Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Repository</h3>
              <div className="space-y-3">
                {repositories.map((repo) => (
                  <div
                    key={repo.name}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProject === repo.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProject(repo.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={selectedProject === repo.name}
                        onChange={() => setSelectedProject(repo.name)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{repo.name}</div>
                        <div className="text-sm text-gray-600">{repo.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Configuration */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deploy Branch</label>
                  <select
                    value={config.branch}
                    onChange={(e) => setConfig(prev => ({ ...prev, branch: e.target.value }))}
                    className="input-field"
                  >
                    <option value="main">main</option>
                    <option value="master">master</option>
                    <option value="production">production</option>
                    <option value="deploy">deploy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Node.js Version</label>
                  <select
                    value={config.nodeVersion}
                    onChange={(e) => setConfig(prev => ({ ...prev, nodeVersion: e.target.value }))}
                    className="input-field"
                  >
                    {nodeVersions.map(version => (
                      <option key={version} value={version}>Node.js {version}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Framework Selection */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Framework</h3>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      config.framework === framework.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFrameworkChange(framework.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{framework.icon}</span>
                      <span className="font-medium text-gray-900">{framework.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Build Configuration */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Build Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Build Command</label>
                  <input
                    type="text"
                    value={config.buildCommand}
                    onChange={(e) => setConfig(prev => ({ ...prev, buildCommand: e.target.value }))}
                    className="input-field"
                    placeholder="npm run build"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Directory</label>
                  <input
                    type="text"
                    value={config.outputDirectory}
                    onChange={(e) => setConfig(prev => ({ ...prev, outputDirectory: e.target.value }))}
                    className="input-field"
                    placeholder="dist"
                  />
                </div>
              </div>
            </div>

            {/* Environment Variables */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Environment Variables</h3>
                <button
                  onClick={addEnvironmentVariable}
                  className="btn-outline text-sm"
                >
                  Add Variable
                </button>
              </div>
              <div className="space-y-3">
                {config.environmentVariables.map((env, index) => (
                  <div key={index} className="flex space-x-3">
                    <input
                      type="text"
                      value={env.key}
                      onChange={(e) => updateEnvironmentVariable(index, 'key', e.target.value)}
                      placeholder="KEY"
                      className="input-field flex-1"
                    />
                    <input
                      type="text"
                      value={env.value}
                      onChange={(e) => updateEnvironmentVariable(index, 'value', e.target.value)}
                      placeholder="value"
                      className="input-field flex-1"
                    />
                    <button
                      onClick={() => removeEnvironmentVariable(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Webhook Configuration */}
          <div className="space-y-6">
            {/* Webhook Setup */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Webhook className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">GitHub Webhook</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Add this webhook to your GitHub repository to enable automatic deployments on push.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payload URL</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={webhookUrl}
                      readOnly
                      className="input-field flex-1 bg-gray-50"
                    />
                    <button
                      onClick={() => handleCopy(webhookUrl, 'url')}
                      className="btn-outline px-3 py-2"
                    >
                      {copied === 'url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secret</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={webhookSecret}
                      readOnly
                      className="input-field flex-1 bg-gray-50"
                    />
                    <button
                      onClick={() => handleCopy(webhookSecret, 'secret')}
                      className="btn-outline px-3 py-2"
                    >
                      {copied === 'secret' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-1">Required Settings</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Content type: <code>application/json</code></li>
                        <li>• Trigger: Just the push event</li>
                        <li>• Active: ✅ Checked</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://github.com/${config.repository}/settings/hooks/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center space-x-2 w-full justify-center"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Configure Webhook on GitHub</span>
                </a>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="webhook-configured"
                    checked={isWebhookConfigured}
                    onChange={(e) => setIsWebhookConfigured(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="webhook-configured" className="text-sm text-gray-700">
                    I have configured the webhook on GitHub
                  </label>
                </div>
              </div>
            </div>

            {/* Configuration Preview */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Configuration Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Repository:</span>
                  <span className="font-medium">{config.repository}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="font-medium">{frameworks.find(f => f.id === config.framework)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Branch:</span>
                  <span className="font-medium">{config.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Node Version:</span>
                  <span className="font-medium">v{config.nodeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Build Command:</span>
                  <span className="font-medium font-mono text-xs">{config.buildCommand || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Output Directory:</span>
                  <span className="font-medium font-mono text-xs">{config.outputDirectory}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-600">Environment Variables:</span>
                  <div className="mt-1 space-y-1">
                    {config.environmentVariables.filter(env => env.key).map((env, index) => (
                      <div key={index} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {env.key}={env.value ? '***' : '<empty>'}
                      </div>
                    ))}
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
            <span>Back to GitHub</span>
          </button>
          
          <button
            className="btn-primary"
            disabled={!isWebhookConfigured}
          >
            Continue to Server Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProjectSetup;
