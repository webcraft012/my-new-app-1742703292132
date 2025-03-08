import { execSync } from 'child_process';
import os from 'os';

/**
 * Class responsible for GitHub repository operations
 */
export class GitHubManager {
  private repoName: string;
  private githubUsername: string;
  private token: string | null;

  /**
   * Creates a new GitHubManager instance
   * @param repoName - The name of the GitHub repository
   * @param options - Additional options
   */
  constructor(
    repoName: string = 'preconfigured-nextjs-app',
    options: {
      githubUsername?: string;
      token?: string;
    } = {},
  ) {
    this.repoName = repoName;
    this.githubUsername =
      options.githubUsername || process.env.GITHUB_USERNAME || 'clad012';
    this.token = options.token || process.env.GITHUB_TOKEN || null;
  }

  /**
   * Checks if the GitHub token is available
   * @returns True if the token is available, false otherwise
   */
  hasToken(): boolean {
    if (!this.token) {
      console.error('Error: GitHub token is not available');
      console.log('Skipping GitHub repository operations...');
      return false;
    }
    return true;
  }

  /**
   * Creates a new GitHub repository
   * @param options - Repository creation options
   * @returns The repository URL or null if creation failed
   */
  async createRepository(
    options: {
      private?: boolean;
      description?: string;
      autoInit?: boolean;
    } = {},
  ): Promise<string | null> {
    if (!this.hasToken()) return null;

    const {
      private: isPrivate = false,
      description = 'Auto-generated Next.js application',
      autoInit = false,
    } = options;

    console.log(`Creating GitHub repository: ${this.repoName}...`);

    try {
      const response = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: {
          Authorization: `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.repoName,
          private: isPrivate,
          description,
          auto_init: autoInit,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Repository created:', data.html_url);
        return data.html_url;
      } else {
        console.error('Error creating repository:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error creating repository:', error);
      return null;
    }
  }

  /**
   * Gets information about an existing repository
   * @returns The repository URL or null if retrieval failed
   */
  async getRepository(): Promise<string | null> {
    if (!this.hasToken()) return null;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.githubUsername}/${this.repoName}`,
        {
          headers: {
            Authorization: `token ${this.token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Repository exists:', data.html_url);
        return data.html_url;
      } else {
        console.error('Error getting repository:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error getting repository:', error);
      return null;
    }
  }

  /**
   * Configures the git remote for the repository
   * @param projectPath - The path to the local project
   */
  configureRemote(projectPath: string): void {
    if (!this.hasToken()) return;

    console.log('Configuring git remote...');

    // Add remote
    execSync(
      `cd ${projectPath} && git remote add origin https://github.com/${this.githubUsername}/${this.repoName}.git`,
      { stdio: 'inherit' },
    );

    // Configure git credentials
    const remoteUrl = `https://${this.githubUsername}:${this.token}@github.com/${this.githubUsername}/${this.repoName}.git`;
    execSync(`cd ${projectPath} && git remote set-url origin ${remoteUrl}`, {
      stdio: 'inherit',
    });
  }

  /**
   * Pushes the local repository to GitHub
   * @param projectPath - The path to the local project
   * @param force - Whether to force push
   */
  pushToRemote(projectPath: string, force: boolean = false): void {
    if (!this.hasToken()) return;

    console.log(`Pushing to GitHub repository${force ? ' (force)' : ''}...`);

    const forceFlag = force ? '--force' : '';

    execSync(
      `cd ${projectPath} && git push -u origin master ${forceFlag} || git push -u origin main ${forceFlag}`,
      {
        stdio: 'inherit',
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: '0', // Disable prompts
        },
      },
    );

    console.log('Successfully pushed to GitHub!');
  }

  /**
   * Creates a repository or uses an existing one, then pushes the local project
   * @param projectPath - The path to the local project
   * @param options - Repository creation options
   * @returns The repository URL or null if the operation failed
   */
  async createAndPush(
    projectPath: string,
    options: {
      private?: boolean;
      description?: string;
      force?: boolean;
    } = {},
  ): Promise<string | null> {
    if (!this.hasToken()) return null;

    const { force = false } = options;
    let repoUrl: string | null = null;

    try {
      // Try to create a new repository
      repoUrl = await this.createRepository(options);

      if (!repoUrl) {
        // Repository might already exist
        console.log(
          `Repository ${this.repoName} might already exist, trying to use it...`,
        );
        repoUrl = await this.getRepository();

        if (!repoUrl) {
          console.error('Could not create or find repository');
          return null;
        }
      }

      // Configure remote and push
      this.configureRemote(projectPath);
      this.pushToRemote(projectPath, force);

      return repoUrl;
    } catch (error: any) {
      // Handle specific error for existing repository
      if (error.status === 422) {
        console.log(
          `Repository ${this.repoName} already exists, using existing repo.`,
        );
        repoUrl = await this.getRepository();

        if (repoUrl) {
          this.configureRemote(projectPath);
          this.pushToRemote(projectPath, true); // Force push to existing repo
        }

        return repoUrl;
      } else {
        console.error('Error in GitHub operations:', error);
        console.log('Continuing without GitHub repository...');
        return null;
      }
    }
  }
}

/**
 * Convenience function to push a project to GitHub
 * @param projectPath - The path to the local project
 * @param repoName - The name of the GitHub repository
 * @param options - Additional options
 * @returns The repository URL or null if the operation failed
 */
export async function pushToGitHub(
  projectPath: string,
  repoName: string = 'preconfigured-nextjs-app',
  options: {
    githubUsername?: string;
    token?: string;
    private?: boolean;
    description?: string;
    force?: boolean;
  } = {},
): Promise<string | null> {
  const manager = new GitHubManager(repoName, options);
  return manager.createAndPush(projectPath, options);
}
