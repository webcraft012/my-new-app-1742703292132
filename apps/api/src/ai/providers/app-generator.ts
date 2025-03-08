import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Class responsible for generating Next.js applications
 */
export class NextJsAppGenerator {
  private projectPath: string;

  /**
   * Creates a new NextJsAppGenerator instance
   * @param projectPath - The path where the Next.js app will be generated
   */
  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }

  /**
   * Cleans the target directory if it exists
   */
  cleanDirectory(): void {
    if (fs.existsSync(this.projectPath)) {
      console.log(`Cleaning existing directory: ${this.projectPath}`);
      fs.rmSync(this.projectPath, { recursive: true, force: true });
    }
  }

  /**
   * Generates a new Next.js application
   * @param options - Options for Next.js app generation
   */
  generate(
    options: {
      typescript?: boolean;
      eslint?: boolean;
      version?: string;
    } = {},
  ): void {
    const { typescript = true, eslint = true, version = 'latest' } = options;

    console.log(`Generating Next.js app in: ${this.projectPath}`);

    const tsFlag = typescript ? '--ts' : '';
    const eslintFlag = eslint ? '--eslint' : '';

    execSync(
      `CI=true npx create-next-app@${version} ${this.projectPath} ${tsFlag} ${eslintFlag}`,
      {
        stdio: 'inherit',
      },
    );

    console.log('Next.js app created successfully!');
  }

  /**
   * Creates a file in the project
   * @param relativePath - Path relative to the project root
   * @param content - Content of the file
   */
  generateFile(relativePath: string, content: string): void {
    const fullPath = path.join(this.projectPath, relativePath);
    const dirPath = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    console.log(`Creating file: ${relativePath}`);
    fs.writeFileSync(fullPath, content);
  }

  /**
   * Creates a .gitignore file with common Next.js exclusions
   */
  generateGitIgnore(): void {
    const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel
`;
    this.generateFile('.gitignore', gitignoreContent);
  }

  /**
   * Initializes a git repository and makes the initial commit
   */
  initializeGit(): void {
    console.log('Initializing git repository...');
    execSync(`cd ${this.projectPath} && git init`, { stdio: 'inherit' });
    execSync(`cd ${this.projectPath} && git add .`, { stdio: 'inherit' });
    execSync(`cd ${this.projectPath} && git commit -m "Initial commit"`, {
      stdio: 'inherit',
    });
    console.log('Git repository initialized with initial commit');
  }

  /**
   * Runs the complete process of generating a Next.js app
   * @param options - Options for Next.js app generation
   */
  runFullGeneration(
    options: {
      typescript?: boolean;
      eslint?: boolean;
      version?: string;
      initGit?: boolean;
    } = {},
  ): void {
    const { initGit = true } = options;

    this.cleanDirectory();
    this.generate(options);
    this.generateGitIgnore();

    if (initGit) {
      this.initializeGit();
    }

    console.log('Next.js app generation completed successfully!');
  }
}

/**
 * Convenience function to generate a Next.js application
 * @param projectPath - The path where the Next.js app will be generated
 * @param options - Options for Next.js app generation
 */
export async function generateNextJsApp(
  projectPath: string,
  options: {
    typescript?: boolean;
    eslint?: boolean;
    version?: string;
    initGit?: boolean;
  } = {},
): Promise<void> {
  const generator = new NextJsAppGenerator(projectPath);
  generator.runFullGeneration(options);
}
