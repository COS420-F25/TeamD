
// Interface to hold all repository info requested from the backend service
export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  private: boolean;
  stars: number;
  language: string | null;
  updatedAt: string | null;
}

export class GitHubRepoService {
  private functionsUrl: string;

  constructor() {
    const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
    const region = process.env.REACT_APP_FUNCTIONS_REGION ;
    const port = process.env.REACT_APP_FUNCTIONS_PORT;

    // Use localhost for development, production URL for deployment
    this.functionsUrl = window.location.hostname === "localhost"
      ? `http://127.0.0.1:${port}/${projectId}/${region}`
      : `https://${region}-${projectId}.cloudfunctions.net`;
  }

  async getRepositories(installationId: string): Promise<Repository[]> {
    const response = await fetch(
      `${this.functionsUrl}/getRepositories?installation_id=${installationId}`
    );

    if (!response.ok) {
      throw new Error('Error fetching repositories');
    }

    const data = await response.json();
    return data.repositories;
  }
}