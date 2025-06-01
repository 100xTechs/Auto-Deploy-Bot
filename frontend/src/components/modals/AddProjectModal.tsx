import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { apiService, type CreateProjectData } from '../../services/apiService';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
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
  const [webhookUrl, setWebhookUrl] = useState<string>('');

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
      setWebhookUrl(response.webhookUrl);
      setAlert({ type: 'success', message: response.message });
      onProjectAdded();
      
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
    setWebhookUrl('');
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setAlert({ type: 'success', message: 'Webhook URL copied to clipboard!' });
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
          )}

          {webhookUrl && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Webhook URL</h4>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-blue-100 px-2 py-1 rounded flex-1 break-all">
                  {webhookUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(webhookUrl)}
                >
                  Copy
                </Button>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Add this URL to your GitHub repository webhook settings.
              </p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
