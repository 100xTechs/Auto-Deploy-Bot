export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
  id: number;
  public_repos: number;
  followers: number;
  following: number;
  bio?: string;
  location?: string;
  blog?: string;
  company?: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  git_url: string;
  svn_url: string;
  language: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
    id: number;
    type: string;
  };
}