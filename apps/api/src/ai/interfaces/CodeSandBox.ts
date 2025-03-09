/**
 * Interface defining the CodeSandBox functionality
 */
export interface ICodeSandBox<T> {
  createSandbox(activeSandboxId?: string): Promise<T>;
  getPreviewUrl(): Promise<string>;
  copyFile(filePath: string, newFilePath: string): Promise<void>;
  writeFile(filePath: string, content: Uint8Array): Promise<void>;
  readFile(filePath: string): Promise<Uint8Array>;
  listDirectory(dirPath: string): Promise<ReaddirEntry[]>;
  deleteFile(filePath: string, recursive?: boolean): Promise<void>;
  rename(oldPath: string, newPath: string): Promise<void>;
  downloadFile(remotePath: string, localPath: string): Promise<void>;
  writeTextFile(filePath: string, content: string): Promise<void>;
  readTextFile(filePath: string): Promise<string>;
  runCommand(command: Command): Promise<{
    output: string;
    exitCode?: number;
  }>;
  createDirectory(dirPath: string, recursive?: boolean): Promise<void>;
  setupGit(remote: string): Promise<void>;
  gitInit(): Promise<any>;
  gitAdd(): Promise<any>;
  gitCommit(message: string): Promise<any>;
  gitPush(): Promise<void>;
  gitCommitAndPush(message: string): Promise<void>;
  setGitRemote(remote: string): Promise<any>;
}

export enum Command {
  dev = 'pnpm dev',
  build = 'pnpm build',
  start = 'pnpm start',
  test = 'pnpm test',
  lint = 'pnpm lint',
  format = 'pnpm format',
  install = 'pnpm install',
}

export type ReaddirEntry = any; // This will be replaced with the actual type if available
