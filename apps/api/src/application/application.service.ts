import { Inject, Injectable } from '@nestjs/common';
import { IApplicationRepository } from './types/application.repository';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './types/application.dto';
import { AiService } from '../ai/ai.service';
import { GitHubManager } from 'src/managers/github-manager';
// import { AwsSandbox } from 'src/sandbox-providers/aws/sandbox';
import { CodeSandBox } from 'src/sandbox-providers/CodeSandBox';
import { InMemoryLogsDB } from 'src/utils/in-memory-logs-db';
import { FileManager } from 'src/managers/file-manager';
import { parseXmlTags } from 'src/utils/tags-parser';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject('IApplicationRepository')
    private repository: IApplicationRepository,
    private aiService: AiService,
    private logsDB: InMemoryLogsDB,
  ) {}

  async generate(application: CreateApplicationDto) {
    const devApp = await this.findOne('efd9dd8d5e4bee4653648eb9431addd4');

    if (devApp) {
      const githubManager = new GitHubManager();
      const tempPath = await githubManager.cloneRepository(
        this.createAppName(application.name),
        devApp.repoUrl,
      );

      const fileManager = new FileManager(tempPath);

      const output = await fileManager.listAllFiles({
        noFileSummary: true,
        outputShowLineNumbers: true,
        style: 'xml',
      });
      console.log({ output });

      const code = await this.aiService.generateCode(
        output,
        'Make a new page called "rooms" that shows a list of rooms',
      );
      const operations = parseXmlTags(code);

      console.log(JSON.stringify(operations, null, 2));

      for (const operation of operations.operations) {
        switch (operation.type) {
          case 'create-file':
            await fileManager.createFile(operation.path, operation.content);
            break;
          case 'delete-file':
            await fileManager.deleteFile(operation.path);
            break;
          case 'edit-file':
            await fileManager.applyCodeEdit(operation.path, {
              startLine: operation.startLine,
              endLine: operation.endLine,
              newContent: operation.content,
            });
            break;
          case 'rename-file':
            await fileManager.renameFile(operation.oldPath, operation.newPath);
            break;
          case 'move-file':
            await fileManager.moveFile(operation.oldPath, operation.newPath);
            break;
          default:
            console.log('Unknown operation', operation);
            break;
        }
      }

      await githubManager.commitAndPush('AI Feature', tempPath);

      const devAppCodeSandbox = new CodeSandBox(devApp.repoUrl, devApp.name);
      await devAppCodeSandbox.createSandbox(devApp.sandboxId);

      await devAppCodeSandbox.gitPull();
      await devAppCodeSandbox.stopDevServer();

      const lintResult = await devAppCodeSandbox.runLint();

      const formatResult = await fileManager.runFormat();

      console.log({ formatResult, lintResult });

      return { formatResult, lintResult };

      const observable = devAppCodeSandbox.startDevServerAndListen();
      observable.subscribe((output) => {
        this.logsDB.addLog(devApp.id, output);
      });
      const devAppPreviewUrl = await devAppCodeSandbox.getPreviewUrl();

      setTimeout(async () => {
        await devAppCodeSandbox.gitPull();
      }, 10000);

      console.log({
        devAppPreviewUrl,
      });

      return {
        devAppPreviewUrl,
      };
    }

    const githubManager = new GitHubManager();
    const { repoUrl, tempPath } = await githubManager.importFromTemplateRepo(
      process.env.NEXTJS_TEMPLATE_REPO,
      this.createAppName(application.name),
    );

    // const awsSandbox = new AwsSandbox(
    //   this.createAppName(application.name),
    //   repoUrl,
    // );

    // const sandbox = await awsSandbox.createSandbox();

    console.log({
      repoUrl,
      tempPath,
    });

    const codeSandbox = new CodeSandBox(
      repoUrl,
      this.createAppName(application.name),
    );

    await codeSandbox.createSandbox();

    const previewUrl = await codeSandbox.getPreviewUrl();

    console.log({
      sandboxId: codeSandbox.sandbox.id,
      previewUrl,
    });

    await this.create({
      ...application,
      repoUrl,
      sandboxProvider: 'codesandbox',
      sandboxId: codeSandbox.sandbox.id,
      previewUrl: previewUrl,
      // metadata: JSON.stringify({
      //   taskArn: sandbox.getTaskArn(),
      //   containerName: sandbox.getContainer(),
      //   clusterName: sandbox.getClusterName(),
      //   taskId: sandbox.getTaskId(),
      // }),
    });

    return { repoUrl, tempPath };
  }

  createAppName(appName: string) {
    return (
      appName
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase() +
      '-' +
      Date.now()
    );
  }

  async create(application: CreateApplicationDto) {
    return this.repository.create(application);
  }

  async update(id: string, application: UpdateApplicationDto) {
    return this.repository.update(id, application);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByUserId(userId: string) {
    return this.repository.findByUserId(userId);
  }
}
