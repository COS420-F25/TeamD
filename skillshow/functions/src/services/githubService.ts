import { App } from "octokit";
import * as fs from "fs";
import * as path from "path";

// Interface to store information about repositories accessed
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

// Service class to resolve github API actions
export class GitHubService {

  // Privately store the authenticated git app instance
  private app: App;

  constructor(appId: string, privateKeyPath: string) {
    // Support both file-based (local dev) and env var (production) private keys
    let privateKey: string;

    if (process.env.GITHUB_PRIVATE_KEY) {
      // Production: use environment variable
      privateKey = process.env.GITHUB_PRIVATE_KEY;
    } else {
      // Development: read from file
      const keyPath = path.resolve(__dirname, "../..", privateKeyPath);
      privateKey = fs.readFileSync(keyPath, "utf8");
    }

    // Create new instance with credentials
    this.app = new App({
      appId,
      privateKey,
    });
  }
  // Fetch and return all repos authorized by users upon installS
  async getUserRepositories(installationId: number): Promise<Repository[]> {

    const octokit = await this.app.getInstallationOctokit(installationId);
    const { data } = await octokit.request("GET /installation/repositories", {
      per_page: 10,
    });

    return data.repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      private: repo.private,
      stars: repo.stargazers_count,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  }
  // Fetch information about a specific repo
  async getRepository(installationId: number, owner: string, repo: string) {
    const octokit = await this.app.getInstallationOctokit(installationId);

    const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo,
    });

    return data;
  }
}
