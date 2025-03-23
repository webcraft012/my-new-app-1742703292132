import * as dotenv from 'dotenv';
import { CodingAgentFactory } from '../agents/coding-agents/AgentFactory';
import { CodingAgent } from '../agents/coding-agents/AgentsConfig';
import { AgentFactory } from '../agents/requirements-agents/AgentFactory';
import { AgentType } from '../agents/requirements-agents/AgentsConfig';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { pageStructureAgentSchema } from '../agents/requirements-agents/prompts';
import { z } from 'zod';
import { RequirementsPipeline } from '../pipelines/RequirementsPipeline';
import { CodingPipeline } from '../pipelines/CodingPipeline';
import { CodeGenerationManager } from 'src/managers';
import { Observable } from 'rxjs';
// Load environment variables
dotenv.config();

export class AiClient implements AiClientInterface {
  constructor(apiKey: string) {}

  async generateCode(
    codeGenerationManager: CodeGenerationManager,
    prompt: string,
  ): Promise<Observable<string>> {
    const requirementsPipeline = new RequirementsPipeline();
    const requirements = await requirementsPipeline.runAll(prompt);
    const codingPipeline = new CodingPipeline(codeGenerationManager);
    return codingPipeline.run(JSON.stringify(requirements), prompt);
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
