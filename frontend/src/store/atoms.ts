import { atom } from 'recoil';

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
    projects: [] as any[],
    loading: false,
    selectedProject: null as any,
  },
});

export const deploymentsState = atom({
  key: 'deploymentsState',
  default: {
    deployments: [] as any[],
    loading: false,
  },
});
