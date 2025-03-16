import { execSync } from 'child_process';
import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * Class responsible for GitHub repository operations
 */
export class GitHubManager {
  private githubUsername: string;
  private token: string | null;

  private repoUrl: string | null;
  private tempPath: string | null;

  /**
   * Creates a new GitHubManager instance
   * @param options - Additional options
   */
  constructor(
    options: {
      githubUsername?: string;
      token?: string;
    } = {},
  ) {
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
   * @param repoName - The name of the GitHub repository
   * @param options - Repository creation options
   * @returns The repository URL or null if creation failed
   */
  async createRepository(
    repoName: string = 'preconfigured-nextjs-app',
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

    console.log(`Creating GitHub repository: ${repoName}...`);

    try {
      const response = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: {
          Authorization: `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName,
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
   * @param repoName - The name of the GitHub repository
   * @returns The repository URL or null if retrieval failed
   */
  async getRepository(repoName: string): Promise<string | null> {
    if (!this.hasToken()) return null;

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.githubUsername}/${repoName}`,
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
   * @param repoName - The name of the GitHub repository
   */
  configureRemote(projectPath: string, repoName: string): void {
    if (!this.hasToken()) return;

    console.log('Configuring git remote...');

    // Add remote
    execSync(
      `cd ${projectPath} && git remote add origin https://github.com/${this.githubUsername}/${repoName}.git`,
      { stdio: 'inherit' },
    );

    // Configure git credentials
    const remoteUrl = `https://${this.githubUsername}:${this.token}@github.com/${this.githubUsername}/${repoName}.git`;
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

  async commitAndPush(commitMessage: string, projectPath = this.tempPath) {
    if (!this.hasToken()) return;

    console.log(`Committing and pushing to GitHub repository...`);

    execSync(
      `cd ${projectPath} && git add . && git commit -m "${commitMessage}"`,
      {
        stdio: 'inherit',
      },
    );

    this.pushToRemote(projectPath, true);
  }

  /**
   * Creates a repository or uses an existing one, then pushes the local project
   * @param projectPath - The path to the local project
   * @param repoName - The name of the GitHub repository
   * @param options - Repository creation options
   * @returns The repository URL or null if the operation failed
   */
  async createAndPush(
    projectPath: string,
    repoName: string = 'preconfigured-nextjs-app',
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
      repoUrl = await this.createRepository(repoName, options);

      if (!repoUrl) {
        // Repository might already exist
        console.log(
          `Repository ${repoName} might already exist, trying to use it...`,
        );
        repoUrl = await this.getRepository(repoName);

        if (!repoUrl) {
          console.error('Could not create or find repository');
          return null;
        }
      }

      // Configure remote and push
      this.configureRemote(projectPath, repoName);
      this.pushToRemote(projectPath, force);

      return repoUrl;
    } catch (error: any) {
      // Handle specific error for existing repository
      if (error.status === 422) {
        console.log(
          `Repository ${repoName} already exists, using existing repo.`,
        );
        repoUrl = await this.getRepository(repoName);

        if (repoUrl) {
          this.configureRemote(projectPath, repoName);
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

  // clone a repo to tmp folder then return the path, it take appName as param and repoURl
  async cloneRepository(appName: string, repoUrl: string) {
    const tempPath = path.join(os.tmpdir(), appName);
    execSync(`git clone ${repoUrl} ${tempPath}`, { stdio: 'inherit' });
    return tempPath;
  }

  /**
   * Creates a new repository by cloning an existing repository as a template
   * @param templateRepoUrl - The URL of the template repository to clone
   * @param newRepoName - The name for the new repository
   * @param options - Additional options for repository creation
   * @returns An object containing the new repository URL and the temporary path
   * @throws Error if any operation fails
   */
  async importFromTemplateRepo(
    templateRepoUrl: string,
    newRepoName: string,
    options: {
      private?: boolean;
      description?: string;
      force?: boolean;
    } = {},
  ): Promise<{ repoUrl: string; tempPath: string }> {
    if (!this.hasToken()) {
      throw new Error('GitHub token is not available');
    }

    // Create a temporary directory with the repo name
    const tempPath = path.join(os.tmpdir(), newRepoName);

    // Create the temp directory if it doesn't exist
    fs.mkdirSync(tempPath, { recursive: true });

    console.log(`Cloning template repository to ${tempPath}...`);

    // Clone the template repository
    execSync(`git clone ${templateRepoUrl} ${tempPath}`, {
      stdio: 'inherit',
    });

    // Remove the original .git directory to start fresh
    const gitDir = path.join(tempPath, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }

    // Initialize a new git repository
    execSync(
      `cd ${tempPath} && git init && git add . && git commit -m "Initial commit from template"`,
      {
        stdio: 'inherit',
      },
    );

    // Create and push to new repository
    const repoUrl = await this.createAndPush(tempPath, newRepoName, options);

    if (!repoUrl) {
      throw new Error('Failed to create or push to the repository');
    }

    return {
      repoUrl,
      tempPath,
    };
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
  const manager = new GitHubManager(options);
  return manager.createAndPush(projectPath, repoName, options);
}

export async function commitAndPush(
  projectPath: string,
  commitMessage: string,
) {
  const manager = new GitHubManager();
  manager.commitAndPush(commitMessage, projectPath);
}

/**
 * Convenience function to create a new repository from an existing template
 * @param templateRepoUrl - The URL of the template repository to clone
 * @param newRepoName - The name for the new repository
 * @param options - Additional options
 * @returns An object containing the new repository URL and the temporary path
 * @throws Error if any operation fails
 */
export async function importFromTemplate(
  templateRepoUrl: string,
  newRepoName: string,
  options: {
    githubUsername?: string;
    token?: string;
    private?: boolean;
    description?: string;
    force?: boolean;
  } = {},
): Promise<{ repoUrl: string; tempPath: string }> {
  const manager = new GitHubManager(options);
  return manager.importFromTemplateRepo(templateRepoUrl, newRepoName, options);
}
