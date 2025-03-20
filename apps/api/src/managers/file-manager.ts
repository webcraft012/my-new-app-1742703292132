import path from 'path';
import fs from 'fs';
import { execSync, spawnSync } from 'child_process';
import { main } from 'knip';
export class FileManager {
  constructor(private readonly projectPath: string) {
    this.initRepomix();
  }

  async initRepomix() {
    // install repomx globally if not installed
    if (!this.isRepomixInstalled()) {
      execSync('npm install -g repomix', { stdio: 'inherit' });
    }
  }

  isRepomixInstalled() {
    try {
      const version = execSync('repomix --version', { stdio: 'inherit' });
      console.log({
        version,
      });
      return true;
    } catch (error) {
      console.error('Repomix is not installed');
      return false;
    }
  }

  async createFile(fileName: string, content: string) {
    const filePath = path.join(this.projectPath, fileName);
    fs.writeFileSync(filePath, content);
  }

  async deleteFile(fileName: string) {
    const filePath = path.join(this.projectPath, fileName);
    fs.unlinkSync(filePath);
  }

  async readFile(fileName: string) {
    const filePath = path.join(this.projectPath, fileName);
    return fs.readFileSync(filePath, 'utf8');
  }

  async writeFile(fileName: string, content: string) {
    const filePath = path.join(this.projectPath, fileName);
    fs.writeFileSync(filePath, content);
  }

  async renameFile(oldFileName: string, newFileName: string) {
    const oldFilePath = path.join(this.projectPath, oldFileName);
    const newFilePath = path.join(this.projectPath, newFileName);
    fs.renameSync(oldFilePath, newFilePath);
  }

  async createDirectory(directoryName: string) {
    const dirPath = path.join(this.projectPath, directoryName);
    fs.mkdirSync(dirPath, { recursive: true });
  }

  async deleteDirectory(directoryName: string) {
    const dirPath = path.join(this.projectPath, directoryName);
    fs.rmdirSync(dirPath, { recursive: true });
  }

  async listAllFiles(
    options?: ListAllFilesOptions,
    dirPath = this.projectPath,
  ): Promise<string> {
    const outputPath =
      options?.output || path.join(this.projectPath, 'repomix/output.txt');

    let command = `repomix ${dirPath} -o ${outputPath}`;

    if (options?.style) command += ` --style ${options.style}`;
    if (options?.parsableStyle) command += ' --parsable-style';
    if (options?.compress) command += ' --compress';
    if (options?.outputShowLineNumbers)
      command += ' --output-show-line-numbers';
    if (options?.copy) command += ' --copy';
    if (options?.noFileSummary) command += ' --no-file-summary';
    if (options?.noDirectoryStructure) command += ' --no-directory-structure';
    if (options?.removeComments) command += ' --remove-comments';
    if (options?.removeEmptyLines) command += ' --remove-empty-lines';
    if (options?.headerText)
      command += ` --header-text "${options.headerText}"`;
    if (options?.instructionFilePath)
      command += ` --instruction-file-path ${options.instructionFilePath}`;
    if (options?.includeEmptyDirectories)
      command += ' --include-empty-directories';

    execSync(command, {
      stdio: 'inherit',
    });

    return fs.readFileSync(outputPath, 'utf8');
  }

  async copyFile(sourceFileName: string, destinationFileName: string) {
    const sourceFilePath = path.join(this.projectPath, sourceFileName);
    const destinationFilePath = path.join(
      this.projectPath,
      destinationFileName,
    );
    fs.copyFileSync(sourceFilePath, destinationFilePath);
  }

  async moveFile(sourceFileName: string, destinationFileName: string) {
    const sourceFilePath = path.join(this.projectPath, sourceFileName);
    const destinationFilePath = path.join(
      this.projectPath,
      destinationFileName,
    );
    fs.renameSync(sourceFilePath, destinationFilePath);
  }

  async getFileSize(fileName: string) {
    const filePath = path.join(this.projectPath, fileName);
    const stats = fs.statSync(filePath);
    return stats.size;
  }

  async getFileExtension(fileName: string) {
    return path.extname(fileName);
  }

  async getFileName(filePath: string) {
    return path.basename(filePath);
  }

  async getFilePath(fileName: string) {
    return path.join(this.projectPath, fileName);
  }

  async applyCodeEdit(filePath: string, codeEdit: CodeEdit) {
    // replace the lines in the file with the new content
    const fileContent = await this.readFile(filePath);
    const lines = fileContent.split('\n');
    const startIndex = codeEdit.startLine - 1;
    const endIndex = codeEdit.endLine - 1;
    lines.splice(startIndex, endIndex - startIndex + 1, codeEdit.newContent);
    const newFileContent = lines.join('\n');
    await this.writeFile(filePath, newFileContent);
  }

  async runFormat() {
    try {
      const result = execSync('prettier --write .', {
        cwd: this.projectPath,
        stdio: 'pipe',
      });
      return {
        output: result.toString(),
        exitCode: 0,
      };
    } catch (error) {
      return {
        output: (error as Error).message,
        exitCode: 1,
      };
    }
  }

  async checkDependencies() {
    // install knip globally if not installed
    if (!this.isKnipInstalled()) {
      execSync('npm install -g knip', { stdio: 'inherit' });
    }
    // call knip with execSync
    const { stdout } = spawnSync(
      'knip',
      ['--production', '--reporter', 'json'],
      {
        cwd: this.projectPath,
        stdio: 'pipe',
      },
    );
    const result: DependencyCheckResult = JSON.parse(stdout.toString());
    const unresolved = result.issues.flatMap((issue) => issue.unresolved);
    const unlisted = result.issues.flatMap((issue) => issue.unlisted);

    const dependencies = this.installUnlistedDependencies(unlisted);
    const components = this.addShadcnUiComponents(unresolved);
    return { dependencies, components };
  }

  installUnlistedDependencies(unlisted: DependencyIssue[]) {
    const names = unlisted.map((issue) => issue.name);
    const dependencies: { name: string; version: string }[] = [];
    names.forEach((name) => {
      try {
        const version = execSync(`npm view ${name} version`, {
          stdio: 'pipe',
        });
        dependencies.push({ name, version: version.toString().trim() });
      } catch (error) {
        console.error(`${name} is not available on npm`);
      }
    });

    return dependencies;
  }

  addShadcnUiComponents(unresolved: DependencyIssue[]) {
    const names = unresolved.map((issue) => issue.name);
    const components: string[] = [];

    names.forEach((name) => {
      // check-if shadcn component with regex @/components/ui/input
      if (/@\/components\/ui\/(\w+)/.test(name)) {
        const match = name.match(/@\/components\/ui\/(\w+)/);
        if (match && match[1]) {
          components.push(match[1]);
        }
      }
    });

    return components;
  }

  isKnipInstalled() {
    try {
      const version = execSync('knip --version', { stdio: 'inherit' });
      console.log({ version });
      return true;
    } catch (error) {
      console.error('Knip is not installed');
      return false;
    }
  }
}

export interface ListAllFilesOptions {
  output?: string;
  style?: string;
  parsableStyle?: boolean;
  compress?: boolean;
  outputShowLineNumbers?: boolean;
  copy?: boolean;
  noFileSummary?: boolean;
  noDirectoryStructure?: boolean;
  removeComments?: boolean;
  removeEmptyLines?: boolean;
  headerText?: string;
  instructionFilePath?: string;
  includeEmptyDirectories?: boolean;
}

export interface CodeEdit {
  startLine: number; // Inclusive starting line (1-indexed)
  endLine: number; // Inclusive ending line (1-indexed)
  newContent: string; // New content to replace the specified lines
}
export interface DependencyIssue {
  name: string;
  line?: number;
  col?: number;
  pos?: number;
}

export interface BinaryIssue {
  name: string;
}

export interface EnumMembersIssue {
  [key: string]: any;
}

export interface FileIssue {
  file: string;
  dependencies: DependencyIssue[];
  optionalPeerDependencies: DependencyIssue[];
  unlisted: DependencyIssue[];
  binaries: BinaryIssue[];
  unresolved: DependencyIssue[];
  exports: DependencyIssue[];
  types: DependencyIssue[];
  enumMembers: EnumMembersIssue;
  duplicates: DependencyIssue[];
}

export interface DependencyCheckResult {
  files: string[];
  issues: FileIssue[];
}
