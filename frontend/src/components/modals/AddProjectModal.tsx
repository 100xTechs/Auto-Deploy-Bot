import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { apiService, type CreateProjectData } from '../../services/apiService';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

interface WebhookInfo {
  url: string;
  secret: string;
  projectId: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onProjectAdded }) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    githubRepo: '',
    githubBranch: 'main',
  });
  const [errors, setErrors] = useState<Partial<CreateProjectData>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [webhookConnected, setWebhookConnected] = useState(false);
  const [isCheckingWebhook, setIsCheckingWebhook] = useState(false);
  const [showWebhookSetup, setShowWebhookSetup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof CreateProjectData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProjectData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.githubRepo.trim()) {
      newErrors.githubRepo = 'GitHub repository is required';
    } else if (!formData.githubRepo.includes('/')) {
      newErrors.githubRepo = 'Repository should be in format: owner/repo-name';
    }

    if (!formData.githubBranch?.trim()) {
      newErrors.githubBranch = 'Branch name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.createProject(formData);
      setWebhookInfo({
        url: response.webhookUrl,
        secret: response.webhookSecret,
        projectId: response.project.id
      });
      setShowWebhookSetup(true);
      setAlert({ type: 'success', message: response.message });
      
      // Reset form
      setFormData({ name: '', githubRepo: '', githubBranch: 'main' });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create project'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setFormData({ name: '', githubRepo: '', githubBranch: 'main' });
    setErrors({});
    setAlert(null);
    setWebhookInfo(null);
    setWebhookConnected(false);
    setIsCheckingWebhook(false);
    setShowWebhookSetup(false);
    onClose();
  };

  const checkWebhookConnection = async () => {
    if (!webhookInfo) return;
    
    setIsCheckingWebhook(true);
    try {
      const response = await apiService.checkWebhookStatus(webhookInfo.projectId);
      if (response.webhookConnected) {
        setWebhookConnected(true);
        setAlert({ type: 'success', message: 'Webhook connected successfully! Your project is ready.' });
        onProjectAdded();
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to check webhook status:', error);
    } finally {
      setIsCheckingWebhook(false);
    }
  };

  // Poll for webhook connection every 5 seconds when in setup mode
  useEffect(() => {
    if (showWebhookSetup && webhookInfo && !webhookConnected) {
      const interval = setInterval(checkWebhookConnection, 5000);
      return () => clearInterval(interval);
    }
  }, [showWebhookSetup, webhookInfo, webhookConnected]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setAlert({ type: 'success', message: `${label} copied to clipboard!` });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Project</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {alert && (
            <div className="mb-4">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}          {showWebhookSetup && webhookInfo && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-blue-800">
                  {webhookConnected ? 'Webhook Connected! ✅' : 'Setup GitHub Webhook'}
                </h4>
                {webhookConnected && (
                  <div className="text-green-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              
              {!webhookConnected && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-800 mb-2">Webhook URL</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-blue-100 px-2 py-2 rounded flex-1 break-all font-mono">
                        {webhookInfo.url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(webhookInfo.url, 'Webhook URL')}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-blue-800 mb-2">Webhook Secret</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-blue-100 px-2 py-2 rounded flex-1 break-all font-mono">
                        {webhookInfo.secret}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(webhookInfo.secret, 'Webhook Secret')}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-100 p-3 rounded-md mb-4">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h5>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Go to your GitHub repository settings</li>
                      <li>Navigate to "Webhooks" section</li>
                      <li>Click "Add webhook"</li>
                      <li>Paste the Webhook URL in "Payload URL"</li>
                      <li>Paste the Webhook Secret in "Secret"</li>
                      <li>Select "Send me everything" or specific events</li>
                      <li>Click "Add webhook"</li>
                    </ol>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isCheckingWebhook && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      <span className="text-sm text-blue-600">
                        {isCheckingWebhook ? 'Waiting for webhook connection...' : 'Add the webhook to GitHub, then we\'ll detect it automatically'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={checkWebhookConnection}
                      disabled={isCheckingWebhook}
                    >
                      Check Now
                    </Button>
                  </div>
                </>
              )}

              {webhookConnected && (
                <div className="text-center">
                  <p className="text-green-700 mb-2">Your webhook is connected and ready!</p>
                  <p className="text-sm text-green-600">We'll automatically deploy when you push to your repository.</p>
                </div>
              )}
            </div>
          )}          {!showWebhookSetup && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Project Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="My Awesome Project"
                required
              />

              <Input
                label="GitHub Repository"
                name="githubRepo"
                type="text"
                value={formData.githubRepo}
                onChange={handleChange}
                error={errors.githubRepo}
                placeholder="username/repository-name"
                required
              />

              <Input
                label="Branch"
                name="githubBranch"
                type="text"
                value={formData.githubBranch}
                onChange={handleChange}
                error={errors.githubBranch}
                placeholder="main"
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading}
                >
                  Create Project
                </Button>
              </div>
            </form>
          )}

          {showWebhookSetup && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={webhookConnected}
              >
                {webhookConnected ? 'Done' : 'Skip for Now'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
