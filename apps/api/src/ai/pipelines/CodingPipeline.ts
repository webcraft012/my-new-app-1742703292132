import {
  CreateFileTag,
  EditFileTag,
  parseXmlTags,
  XmlTagResult,
} from 'src/utils/tags-parser';
import { CodingAgentFactory } from '../agents/coding-agents/AgentFactory';
import {
  BaseTools,
  CodingAgent,
  makeAgentToolsConfig,
} from '../agents/coding-agents/AgentsConfig';
import { CodeGenerationManager } from 'src/managers';
import { Observable } from 'rxjs';

export class CodingPipeline {
  constructor(readonly codeGenerationManager: CodeGenerationManager) {}

  async run(requirements: string, prompt: string) {
    const result = await CodingAgentFactory.createAgent({
      type: CodingAgent.Orchestrator,
      requirements,
      codeBase: await this.codeGenerationManager.listAllFiles(),
      tools: {} as never,
    })
      .setPrompt(prompt)
      .run();

    const actions = parseXmlTags(result);
    return this.applyActions(actions.operations);
  }

  async applyActions(actions: XmlTagResult[]) {
    return new Observable<string>((observer) => {
      (async () => {
        for (const action of actions) {
          switch (action.type) {
            case 'create-file': {
              const result = await CodingAgentFactory.createAgent({
                type: CodingAgent.CreateFile,
                action: action.content,
                codeBaseStructure:
                  await this.codeGenerationManager.listAllFiles(),
                tools: this.makeBaseTools(),
              }).run();

              const actions = parseXmlTags(result);
              const createFileAction = actions.operations.filter(
                (a) => a.type === 'create-file',
              );

              observer.next(
                `Files ${createFileAction.map((a) => a.path)} created`,
              );
              break;
            }
            case 'edit-file': {
              const result = await CodingAgentFactory.createAgent({
                type: CodingAgent.EditFile,
                action: action.content,
                codeBaseStructure:
                  await this.codeGenerationManager.listAllFiles(),
                tools: this.makeBaseTools(),
              }).run();

              const actions = parseXmlTags(result);
              const editFileAction = actions.operations.filter(
                (a) => a.type === 'edit-file',
              );

              observer.next(
                `Files ${editFileAction.map((a) => a.path)} edited`,
              );
              break;
            }
          }
        }
      })().catch((error) => observer.error(error));
    });
  }

  makeBaseTools(): BaseTools {
    return {
      'read-file': makeAgentToolsConfig('read-file', async (args) => {
        return this.codeGenerationManager.readFile(args.path);
      }),
    };
  }

  async createFiles(actions: CreateFileTag[]) {
    for (const action of actions) {
      await this.codeGenerationManager.createFile(action.path, action.content);
    }
  }

  async editFiles(actions: EditFileTag[]) {
    for (const action of actions) {
      await this.codeGenerationManager.applyCodeEdit(action.path, {
        startLine: action.startLine,
        endLine: action.endLine,
        newContent: action.content,
      });
    }
  }
}
