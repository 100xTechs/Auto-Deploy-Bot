import React, { useState } from 'react';
import { Shield, Key, Smartphone, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, Trash2, Plus, Copy, RotateCcw } from 'lucide-react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  isCurrent: boolean;
}

const SettingsSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Server',
      key: 'adb_live_sk_abc123def456ghi789',
      permissions: ['deployments:read', 'deployments:write'],
      createdAt: '2024-01-10T10:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z',
      isActive: true
    },
    {
      id: '2',
      name: 'CI/CD Pipeline',
      key: 'adb_live_sk_xyz789abc123def456',
      permissions: ['deployments:read'],
      createdAt: '2024-01-05T15:20:00Z',
      lastUsed: null,
      isActive: false
    }
  ]);

  const [loginSessions] = useState<LoginSession[]>([
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.100',
      loginTime: '2024-01-15T10:00:00Z',
      lastActivity: '2024-01-15T14:30:00Z',
      isCurrent: true
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      ipAddress: '192.168.1.101',
      loginTime: '2024-01-14T09:15:00Z',
      lastActivity: '2024-01-14T18:45:00Z',
      isCurrent: false
    }
  ]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully');
    }, 1000);
  };

  const handleCreateAPIKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `adb_live_sk_${Math.random().toString(36).substring(2, 15)}`,
      permissions: ['deployments:read'],
      createdAt: new Date().toISOString(),
      lastUsed: null,
      isActive: true
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const handleRevokeAPIKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
  };

  const handleCopyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account security and access controls</p>
      </div>

      <div className="space-y-8">
        {/* Password Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Password</h2>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword || isChangingPassword}
              className="btn-primary"
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Password Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Smartphone className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h2>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {twoFactorEnabled ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Smartphone className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">Authenticator App</div>
                <div className="text-sm text-gray-600">
                  {twoFactorEnabled 
                    ? 'Two-factor authentication is enabled'
                    : 'Add an extra layer of security to your account'
                  }
                </div>
              </div>
            </div>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`btn-outline ${
                twoFactorEnabled 
                  ? 'text-red-600 border-red-300 hover:bg-red-50' 
                  : 'text-green-600 border-green-300 hover:bg-green-50'
              }`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>

          {!twoFactorEnabled && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Recommended Security Practice</h4>
                  <p className="text-sm text-yellow-700">
                    Enable two-factor authentication to significantly improve your account security.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* API Keys */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Key className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">API Keys</h2>
            </div>
            <button
              onClick={handleCreateAPIKey}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Key</span>
            </button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      apiKey.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{apiKey.name}</div>
                      <div className="text-sm text-gray-600">
                        Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        {apiKey.lastUsed && (
                          <span> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="btn-outline px-3 py-1 text-sm"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRevokeAPIKey(apiKey.id)}
                      className="btn-outline px-3 py-1 text-sm text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <div className="text-sm font-mono bg-gray-100 p-2 rounded border mb-3">
                  {apiKey.key}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {apiKey.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {apiKeys.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No API keys created yet</p>
                <p className="text-sm">Create your first API key to start using the API</p>
              </div>
            )}
          </div>
        </div>

        {/* Login Sessions */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="h-6 w-6 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Active Sessions</h2>
          </div>

          <div className="space-y-4">
            {loginSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    session.isCurrent ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {session.isCurrent ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {session.device}
                      {session.isCurrent && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.location} • {session.ipAddress}
                    </div>
                    <div className="text-sm text-gray-500">
                      Logged in {new Date(session.loginTime).toLocaleDateString()} • 
                      Last activity {new Date(session.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button className="btn-outline px-3 py-1 text-sm text-red-600 border-red-300 hover:bg-red-50">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50 inline-flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>Sign Out All Other Sessions</span>
            </button>
          </div>
        </div>

        {/* Security Recommendations */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Security Recommendations</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Strong Password</div>
                <div className="text-sm text-gray-600">Your password meets our security requirements</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              {twoFactorEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              )}
              <div>
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">
                  {twoFactorEnabled 
                    ? 'Two-factor authentication is enabled'
                    : 'Enable 2FA for additional security'
                  }
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900">Recent Activity</div>
                <div className="text-sm text-gray-600">No suspicious login attempts detected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSecurity;
