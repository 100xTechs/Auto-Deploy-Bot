const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Project {
  id: string;
  name: string;
  githubRepo: string;
  githubBranch: string;
  webhookSecret?: string;
  createdAt: string;
  updatedAt: string;
  deployments?: Deployment[];
  _count?: {
    deployments: number;
  };
}

export interface Deployment {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  commitHash: string;
  commitMsg?: string;
  triggeredBy?: string;
  deployedAt?: string;
  createdAt: string;
  project?: {
    name: string;
    githubRepo?: string;
  };
}

export interface CreateProjectData {
  name: string;
  githubRepo: string;
  githubBranch?: string;
}

export interface CreateDeploymentData {
  projectId: string;
  commitHash: string;
  commitMsg?: string;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeader(),
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Project endpoints
  async getProjects(): Promise<{ projects: Project[] }> {
    return this.makeRequest<{ projects: Project[] }>('/api/v1/projects');
  }

  async getProject(id: string): Promise<{ project: Project }> {
    return this.makeRequest<{ project: Project }>(`/api/v1/projects/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<{ message: string; project: Project; webhookUrl: string }> {
    return this.makeRequest<{ message: string; project: Project; webhookUrl: string }>('/api/v1/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<CreateProjectData>): Promise<{ message: string; project: Project }> {
    return this.makeRequest<{ message: string; project: Project }>(`/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/api/v1/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Deployment endpoints
  async getDeployments(): Promise<{ deployments: Deployment[] }> {
    return this.makeRequest<{ deployments: Deployment[] }>('/api/v1/deployments');
  }

  async getProjectDeployments(projectId: string): Promise<{ deployments: Deployment[] }> {
    return this.makeRequest<{ deployments: Deployment[] }>(`/api/v1/projects/${projectId}/deployments`);
  }

  async createDeployment(data: CreateDeploymentData): Promise<{ message: string; deployment: Deployment }> {
    return this.makeRequest<{ message: string; deployment: Deployment }>('/api/v1/deployments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDeploymentStatus(id: string, status: Deployment['status']): Promise<{ message: string; deployment: Deployment }> {
    return this.makeRequest<{ message: string; deployment: Deployment }>(`/api/v1/deployments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();
