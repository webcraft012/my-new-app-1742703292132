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
      codeBase: await this.codeGenerationManager.fileManager.listAllFiles({
        noFileSummary: true,
        outputShowLineNumbers: true,
        style: 'xml',
      }),
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
        const codeBaseStructure =
          await this.codeGenerationManager.fileManager.listAllFiles({
            noFileSummary: true,
            compress: true,
            outputShowLineNumbers: true,
            style: 'xml',
          });

        for (const action of actions) {
          switch (action.type) {
            case 'create-file': {
              console.log('Will create file', action);
              const result = await CodingAgentFactory.createAgent({
                type: CodingAgent.CreateFile,
                codeBaseStructure,
                tools: this.makeBaseTools(),
              })
                .setPrompt(
                  `<create-file path="${action.path}">
                  ${action.content}
                  </create-file>`,
                )
                .run();

              const actions = parseXmlTags(result);
              if (actions.operations.length === 0) {
                console.log('Create file failed', result);
              }

              console.log('Create file actions', actions);
              const createFileAction: CreateFileTag[] =
                actions.operations.filter(
                  (a) => a.type === 'create-file',
                ) as CreateFileTag[];

              await this.createFiles(createFileAction);

              observer.next(
                `Files ${createFileAction.map((a) => a.path)} created`,
              );
              break;
            }
            case 'edit-file': {
              console.log('Will edit file', action);
              const result = await CodingAgentFactory.createAgent({
                type: CodingAgent.EditFile,
                codeBaseStructure,
                tools: this.makeBaseTools(),
                toolRequired: true,
              })
                .setPrompt(
                  `<edit-file path="${action.path}">
                  ${action.content}
                  </edit-file>`,
                )
                .run();
              console.log('Edit file result', result);
              const actions = parseXmlTags(result);
              console.log('Edit file actions', actions);
              const editFileAction: EditFileTag[] = actions.operations.filter(
                (a) => a.type === 'edit-file',
              ) as EditFileTag[];

              await this.editFiles(editFileAction);

              observer.next(
                `Files ${editFileAction.map((a) => a.path)} edited`,
              );
              break;
            }
          }
        }
      })().catch((error) => {
        console.error(error);
        observer.error(error);
      });
    });
  }

  makeBaseTools(): BaseTools {
    return {
      'read-file': makeAgentToolsConfig('read-file', async (args) => {
        console.log('[TOOL-CALL] read-file', args);
        try {
          const content = await this.codeGenerationManager.readFile(args.path);
          return content;
        } catch (error) {
          console.error('[TOOL-CALL] read-file', error);
          return 'File not found';
        }
      }),
    };
  }

  async createFiles(actions: CreateFileTag[]) {
    for (const action of actions) {
      console.log('Will create file', action.path);
      await this.codeGenerationManager.createFile(action.path, action.content);
      console.log('File created', action.path);
    }
  }

  async editFiles(actions: EditFileTag[]) {
    for (const action of actions) {
      console.log('Will edit file', action.path);
      await this.codeGenerationManager.applyCodeEdit(action.path, {
        startLine: action.startLine,
        endLine: action.endLine,
        newContent: action.content,
      });
      console.log('File edited', action.path);
    }
  }
}
