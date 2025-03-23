import { ICodeSandBox } from 'src/ai/interfaces/CodeSandBox';
import { CodeSandBoxFactory } from 'src/sandbox-providers/CodeSandBoxFactory';
import { CodeEdit, FileManager } from './file-manager';
import { GitHubManager } from './github-manager';

const USE_CODE_SANDBOX_FS = false;

export class CodeGenerationManager {
  private projectTmpPath: string;
  private repoUrl?: string;
  private _fileManager: FileManager;
  private codeSandbox: ICodeSandBox;
  private activeSandboxId?: string;
  private githubManager: GitHubManager;
  constructor(
    private readonly appName: string,
    private readonly provider: 'aws' | 'codesandbox' = 'codesandbox',
    repoUrl?: string,
    activeSandboxId?: string,
  ) {
    this.repoUrl = repoUrl;
    this.activeSandboxId = activeSandboxId;
  }

  async init() {
    this.githubManager = new GitHubManager();

    if (this.repoUrl) {
      console.log('Cloning existing repository', this.repoUrl);
      this.projectTmpPath = await this.githubManager.cloneRepository(
        this.appName,
        this.repoUrl,
      );
    } else {
      console.log(
        'Importing from template repository',
        process.env.NEXTJS_TEMPLATE_REPO,
      );
      const { repoUrl, tempPath } =
        await this.githubManager.importFromTemplateRepo(
          process.env.NEXTJS_TEMPLATE_REPO,
          this.appName,
        );
      this.repoUrl = repoUrl;
      this.projectTmpPath = tempPath;
    }

    this._fileManager = new FileManager(this.projectTmpPath);
    this.codeSandbox = CodeSandBoxFactory.createCodeSandBox(
      this.provider,
      this.appName,
      this.repoUrl,
    );
    await this.codeSandbox.createSandbox(this.activeSandboxId);
    this.activeSandboxId = await this.codeSandbox.getId();
  }

  getProjectTmpPath() {
    return this.projectTmpPath;
  }

  getRepoUrl() {
    return this.repoUrl;
  }

  getActiveSandboxId() {
    return this.activeSandboxId;
  }

  getPreviewUrl() {
    return this.codeSandbox.getPreviewUrl();
  }

  public get fileManager() {
    return this._fileManager;
  }

  readFile(path: string) {
    if (USE_CODE_SANDBOX_FS) {
      return this.codeSandbox.readFile(path);
    }
    return this.fileManager.readFile(path);
  }

  async syncChangesInSandbox(commitMessage: string) {
    await this.codeSandbox.gitCommitAndPush(commitMessage);
    await this.githubManager.gitPull(this.repoUrl, this.projectTmpPath);
  }

  async syncChangesInLocal(commitMessage: string) {
    await this.githubManager.commitAndPush(commitMessage, this.projectTmpPath);
    await this.codeSandbox.gitPull();
  }

  async writeFile(path: string, content: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.writeTextFile(path, content);
      await this.syncChangesInSandbox('Update ' + path);
      return;
    }
    await this.fileManager.writeFile(path, content);
    await this.syncChangesInLocal('Update ' + path);
  }

  async deleteFile(path: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.deleteFile(path);
      await this.syncChangesInSandbox('Delete ' + path);
      return;
    }
    await this.fileManager.deleteFile(path);
    await this.syncChangesInLocal('Delete ' + path);
  }

  async renameFile(oldPath: string, newPath: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.rename(oldPath, newPath);
      await this.syncChangesInSandbox('Rename ' + oldPath + ' to ' + newPath);
      return;
    }
    await this.fileManager.renameFile(oldPath, newPath);
    await this.syncChangesInLocal('Rename ' + oldPath + ' to ' + newPath);
  }

  async createFile(path: string, content: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.writeTextFile(path, content);
      await this.syncChangesInSandbox('Create ' + path);
      return;
    }
    await this.fileManager.createFile(path, content);
    await this.syncChangesInLocal('Create ' + path);
  }

  async createDirectory(path: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.createDirectory(path);
      await this.syncChangesInSandbox('Create directory ' + path);
      return;
    }
    await this.fileManager.createDirectory(path);
    await this.syncChangesInLocal('Create directory ' + path);
  }

  listAllFiles() {
    if (USE_CODE_SANDBOX_FS) {
      return this.codeSandbox.listAllFiles();
    }
    return this.fileManager.listAllFiles();
  }

  async copyFile(sourcePath: string, destinationPath: string) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.copyFile(sourcePath, destinationPath);
      await this.syncChangesInSandbox(
        'Copy ' + sourcePath + ' to ' + destinationPath,
      );
      return;
    }
    await this.fileManager.copyFile(sourcePath, destinationPath);
    await this.syncChangesInLocal(
      'Copy ' + sourcePath + ' to ' + destinationPath,
    );
  }

  async applyCodeEdit(filePath: string, codeEdit: CodeEdit) {
    if (USE_CODE_SANDBOX_FS) {
      await this.codeSandbox.applyCodeEdit(filePath, codeEdit);
      await this.syncChangesInSandbox('Apply code edit to ' + filePath);
      return;
    }
    await this.fileManager.applyCodeEdit(filePath, codeEdit);
    await this.syncChangesInLocal('Apply code edit to ' + filePath);
  }
}
