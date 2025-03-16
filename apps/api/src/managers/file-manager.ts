import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import * as diff from 'diff';
import os from 'os';
import knip from 'knip-test';

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

  async testKnip() {
    // install knip globally if not installed
    if (!this.isKnipInstalled()) {
      execSync('npm install -g knip', { stdio: 'inherit' });
    }

    execSync('knip', {
      cwd: this.projectPath,
      stdio: 'inherit',
    });
  }

  isKnipInstalled() {
    try {
      execSync('knip --version', { stdio: 'inherit' });
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
