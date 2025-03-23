import { parseXmlTags, XmlTagResult } from 'src/utils/tags-parser';
import { CodingAgentFactory } from '../agents/coding-agents/AgentFactory';
import {
  BaseTools,
  CodingAgent,
  makeAgentToolsConfig,
} from '../agents/coding-agents/AgentsConfig';

export class CodingPipeline {
  constructor(readonly tools: BaseTools) {}

  async run(requirements: string, codeBase: string, prompt: string) {
    const result = await CodingAgentFactory.createAgent({
      type: CodingAgent.Orchestrator,
      requirements,
      codeBase,
      tools: {} as never,
    })
      .setPrompt(prompt)
      .run();

    const actions = parseXmlTags(result);
    return actions;
  }

  async applyActions(actions: XmlTagResult[], codeBase: string) {
    for (const action of actions) {
      switch (action.type) {
        case 'create-file':
          return CodingAgentFactory.createAgent({
            type: CodingAgent.CreateFile,
            action: action.content,
            codeBaseStructure: codeBase,
            tools: this.tools,
          }).run();
        case 'edit-file':
          return CodingAgentFactory.createAgent({
            type: CodingAgent.EditFile,
            action: action.content,
            codeBaseStructure: codeBase,
            tools: this.tools,
          }).run();
      }
    }
  }
}
