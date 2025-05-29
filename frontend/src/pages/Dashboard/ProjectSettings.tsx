import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Key, 
  Globe, 
  Code, 
  Bell, 
  Shield, 
  Trash2, 
  Copy, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings,
  Terminal
} from 'lucide-react';

interface ProjectSettings {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  environment: string;
  autoDeployEnabled: boolean;
  webhookUrl: string;
  webhookSecret: string;
  deployScript: string;
  buildCommand: string;
  outputDirectory: string;
  nodeVersion: string;
  environmentVariables: { key: string; value: string; isSecret: boolean }[];
  notifications: {
    email: boolean;
    slack: boolean;
    discord: boolean;
  };
}

const ProjectSettings = () => {
  const { id } = useParams();
  const [settings, setSettings] = useState<ProjectSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'deployment' | 'webhook' | 'environment' | 'notifications' | 'danger'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setSettings({
      id: id || '1',
      name: 'My Web App',
      description: 'A modern web application built with React and Node.js',
      repository: 'user/webapp',
      branch: 'main',
      environment: 'production',
      autoDeployEnabled: true,
      webhookUrl: 'https://api.auto-deploy-bot.com/webhook/abc123',
      webhookSecret: 'wh_secret_abc123xyz789',
      deployScript: `#!/bin/bash
# Auto-Deploy-Bot Deployment Script
echo "Starting deployment..."

# Install dependencies
npm install

# Build the application
npm run build

# Restart the application
pm2 restart app

echo "Deployment completed successfully!"`,
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
      nodeVersion: '18.x',
      environmentVariables: [
        { key: 'NODE_ENV', value: 'production', isSecret: false },
        { key: 'API_URL', value: 'https://api.example.com', isSecret: false },
        { key: 'DATABASE_URL', value: '***', isSecret: true },
        { key: 'JWT_SECRET', value: '***', isSecret: true }
      ],
      notifications: {
        email: true,
        slack: false,
        discord: false
      }
    });
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(null), 3000);
    }, 1000);
  };

  const generateNewWebhookSecret = () => {
    const newSecret = 'wh_secret_' + Math.random().toString(36).substr(2, 15);
    if (settings) {
      setSettings({ ...settings, webhookSecret: newSecret });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show copy feedback
  };

  const addEnvironmentVariable = () => {
    if (settings) {
      setSettings({
        ...settings,
        environmentVariables: [
          ...settings.environmentVariables,
          { key: '', value: '', isSecret: false }
        ]
      });
    }
  };

  const removeEnvironmentVariable = (index: number) => {
    if (settings) {
      const newVars = settings.environmentVariables.filter((_, i) => i !== index);
      setSettings({ ...settings, environmentVariables: newVars });
    }
  };

  const updateEnvironmentVariable = (index: number, field: 'key' | 'value' | 'isSecret', value: string | boolean) => {
    if (settings) {
      const newVars = [...settings.environmentVariables];
      newVars[index] = { ...newVars[index], [field]: value };
      setSettings({ ...settings, environmentVariables: newVars });
    }
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Project Settings</h1>
                <p className="text-gray-600">{settings.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {saveMessage && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {saveMessage}
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'deployment', label: 'Deployment', icon: Terminal },
                { id: 'webhook', label: 'Webhook', icon: Code },
                { id: 'environment', label: 'Environment', icon: Globe },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">General Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repository
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={settings.repository}
                          onChange={(e) => setSettings({ ...settings, repository: e.target.value })}
                          className="input-field flex-1"
                        />
                        <ExternalLink className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Branch
                      </label>
                      <input
                        type="text"
                        value={settings.branch}
                        onChange={(e) => setSettings({ ...settings, branch: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Environment
                      </label>
                      <select
                        value={settings.environment}
                        onChange={(e) => setSettings({ ...settings, environment: e.target.value })}
                        className="input-field"
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={settings.description}
                        onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                        rows={3}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.autoDeployEnabled}
                        onChange={(e) => setSettings({ ...settings, autoDeployEnabled: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enable automatic deployments on push to {settings.branch}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Deployment Settings */}
            {activeTab === 'deployment' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Build Configuration</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Build Command
                      </label>
                      <input
                        type="text"
                        value={settings.buildCommand}
                        onChange={(e) => setSettings({ ...settings, buildCommand: e.target.value })}
                        className="input-field"
                        placeholder="npm run build"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Output Directory
                      </label>
                      <input
                        type="text"
                        value={settings.outputDirectory}
                        onChange={(e) => setSettings({ ...settings, outputDirectory: e.target.value })}
                        className="input-field"
                        placeholder="dist"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Node.js Version
                      </label>
                      <select
                        value={settings.nodeVersion}
                        onChange={(e) => setSettings({ ...settings, nodeVersion: e.target.value })}
                        className="input-field"
                      >
                        <option value="16.x">16.x</option>
                        <option value="18.x">18.x</option>
                        <option value="20.x">20.x</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Deployment Script</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Custom deployment script that will be executed on your server after a successful build.
                  </p>
                  <textarea
                    value={settings.deployScript}
                    onChange={(e) => setSettings({ ...settings, deployScript: e.target.value })}
                    rows={12}
                    className="input-field font-mono text-sm"
                    placeholder="#!/bin/bash&#10;echo 'Starting deployment...'"
                  />
                </div>
              </div>
            )}

            {/* Webhook Settings */}
            {activeTab === 'webhook' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">GitHub Webhook</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Add this webhook URL to your GitHub repository settings to enable automatic deployments.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={settings.webhookUrl}
                          readOnly
                          className="input-field flex-1 bg-gray-50"
                        />
                        <button
                          onClick={() => copyToClipboard(settings.webhookUrl)}
                          className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook Secret
                      </label>
                      <div className="flex items-center">
                        <input
                          type="password"
                          value={settings.webhookSecret}
                          readOnly
                          className="input-field flex-1 bg-gray-50"
                        />
                        <button
                          onClick={() => copyToClipboard(settings.webhookSecret)}
                          className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={generateNewWebhookSecret}
                          className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                          title="Generate new secret"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Keep this secret secure. It's used to verify webhook authenticity.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions</h3>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Go to your GitHub repository settings</li>
                      <li>Click on "Webhooks" in the left sidebar</li>
                      <li>Click "Add webhook"</li>
                      <li>Paste the webhook URL above</li>
                      <li>Set Content type to "application/json"</li>
                      <li>Paste the secret above</li>
                      <li>Select "Just the push event"</li>
                      <li>Click "Add webhook"</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Environment Variables */}
            {activeTab === 'environment' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Environment Variables</h2>
                    <button
                      onClick={addEnvironmentVariable}
                      className="btn-primary"
                    >
                      Add Variable
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Environment variables that will be available during the build and deployment process.
                  </p>

                  <div className="space-y-4">
                    {settings.environmentVariables.map((env, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <input
                          type="text"
                          placeholder="Variable name"
                          value={env.key}
                          onChange={(e) => updateEnvironmentVariable(index, 'key', e.target.value)}
                          className="input-field flex-1"
                        />
                        <input
                          type={env.isSecret ? 'password' : 'text'}
                          placeholder="Variable value"
                          value={env.value}
                          onChange={(e) => updateEnvironmentVariable(index, 'value', e.target.value)}
                          className="input-field flex-1"
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={env.isSecret}
                            onChange={(e) => updateEnvironmentVariable(index, 'isSecret', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Secret</span>
                        </label>
                        <button
                          onClick={() => removeEnvironmentVariable(index)}
                          className="p-2 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {settings.environmentVariables.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No environment variables configured. Add one to get started.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Configure how you want to be notified about deployment status.
                  </p>

                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Email notifications</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.slack}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, slack: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Slack notifications</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications.discord}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, discord: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">Discord notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <h2 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h2>
                  
                  <div className="space-y-6">
                    <div className="border border-red-200 rounded-lg p-4">
                      <h3 className="text-red-800 font-medium mb-2">Disable Auto-Deploy</h3>
                      <p className="text-red-700 text-sm mb-4">
                        This will stop all automatic deployments. You can still deploy manually.
                      </p>
                      <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium">
                        Disable Auto-Deploy
                      </button>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4">
                      <h3 className="text-red-800 font-medium mb-2">Reset Webhook</h3>
                      <p className="text-red-700 text-sm mb-4">
                        This will generate a new webhook URL and secret. You'll need to update your GitHub settings.
                      </p>
                      <button className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-md text-sm font-medium">
                        Reset Webhook
                      </button>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4">
                      <h3 className="text-red-800 font-medium mb-2">Delete Project</h3>
                      <p className="text-red-700 text-sm mb-4">
                        Once you delete a project, there is no going back. Please be certain.
                      </p>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                        Delete Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
