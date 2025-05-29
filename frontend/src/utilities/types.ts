export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  email: string;
}

export interface GitHubRepository {
  name: string;
  full_name: string;
  description: string;
  private: boolean;
}