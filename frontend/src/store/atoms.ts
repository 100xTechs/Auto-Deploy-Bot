import { atom } from 'recoil';
import type { Project, Deployment } from '../services/apiService';

export interface User {
  id: string;
  username: string;
}

export const authState = atom({
  key: 'authState',
  default: {
    isAuthenticated: false,
    user: null as User | null,
    token: null as string | null,
    loading: false,
  },
});

export const projectsState = atom({
  key: 'projectsState',
  default: {
    projects: [] as Project[],
    loading: false,
    selectedProject: null as Project | null,
  },
});

export const deploymentsState = atom({
  key: 'deploymentsState',
  default: {
    deployments: [] as Deployment[],
    loading: false,
  },
});
