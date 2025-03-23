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
import { CodeGenerationManager } from 'src/managers/code-generation-manager';

@Injectable()
export class ApplicationService {
  constructor(
    @Inject('IApplicationRepository')
    private repository: IApplicationRepository,
    private aiService: AiService,
    private logsDB: InMemoryLogsDB,
  ) {}

  async generate(application: CreateApplicationDto) {
    const devApp = await this.findOne('76b618222c8bd7b1d06da1c4f205e200');

    const codeGenerationManager = new CodeGenerationManager(
      this.createAppName(application.name),
      'codesandbox',
      devApp?.repoUrl,
      devApp?.sandboxId,
    );

    await codeGenerationManager.init();

    const repoUrl = codeGenerationManager.getRepoUrl();
    const tempPath = codeGenerationManager.getProjectTmpPath();
    const activeSandboxId = await codeGenerationManager.getActiveSandboxId();
    const previewUrl = await codeGenerationManager.getPreviewUrl();

    await this.create({
      ...application,
      repoUrl: codeGenerationManager.getRepoUrl(),
      sandboxProvider: 'codesandbox',
      sandboxId: activeSandboxId,
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
