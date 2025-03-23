import * as dotenv from 'dotenv';
import { CodingAgentFactory } from '../agents/coding-agents/AgentFactory';
import { CodingAgent } from '../agents/coding-agents/AgentsConfig';
import { AgentFactory } from '../agents/requirements-agents/AgentFactory';
import { AgentType } from '../agents/requirements-agents/AgentsConfig';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { pageStructureAgentSchema } from '../agents/requirements-agents/prompts';
import { z } from 'zod';
// Load environment variables
dotenv.config();

export class AiClient implements AiClientInterface {
  constructor(apiKey: string) {}

  async generateCode(
    requirements: string,
    codeBase: string,
    prompt: string,
  ): Promise<string> {
    const result = await CodingAgentFactory.createAgent({
      type: CodingAgent.Orchestrator,
      requirements,
      codeBase,
    })
      .setPrompt(prompt)
      .run();
    return result;
  }

  async getAppRequirements(
    prompt: string,
  ): Promise<z.infer<typeof pageStructureAgentSchema>[]> {
    console.log('Generating content...');

    const appConfig = await AgentFactory.createAgent(AgentType.Master)
      .setPrompt(prompt)
      .run();
    console.log('Config generated...', appConfig);
    const ui = await AgentFactory.createAgent(AgentType.Ui)
      .setPrompt(JSON.stringify(appConfig))
      .run();

    console.log(ui);
    console.log('UI config generated...');

    const pageStructures: z.infer<typeof pageStructureAgentSchema>[] = [];
    for (const page of ui.pages) {
      const pageStructure = await AgentFactory.createAgent(AgentType.Page)
        .setPrompt(JSON.stringify(page))
        .run();
      console.log('Page structure generated...');
      pageStructures.push(pageStructure);
    }
    return pageStructures;
  }
}
