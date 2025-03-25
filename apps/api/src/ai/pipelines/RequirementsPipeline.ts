import { Agent } from '../agents/requirements-agents/Agent';
import { masterAgentSchema } from '../agents/requirements-agents/prompts/master-agent';
import { uiAgentSchema } from '../agents/requirements-agents/prompts/ui-agent';
import { pageStructureAgentSchema } from '../agents/requirements-agents/prompts';
import { z } from 'zod';
import { AgentFactory } from '../agents/requirements-agents/AgentFactory';
import { AgentType } from '../agents/requirements-agents/AgentsConfig';

export class RequirementsPipeline {
  private masterRequrirementsAgent: Agent<z.infer<typeof masterAgentSchema>>;
  private uiRequirementsAgent: Agent<z.infer<typeof uiAgentSchema>>;
  private pageRequirementsAgent: Agent<
    z.infer<typeof pageStructureAgentSchema>
  >;

  constructor() {
    this.masterRequrirementsAgent = AgentFactory.createAgent(AgentType.Master);

    this.uiRequirementsAgent = AgentFactory.createAgent(AgentType.Ui);

    this.pageRequirementsAgent = AgentFactory.createAgent(AgentType.Page);
  }

  async runAll(prompt: string) {
    const appRequirements = await this.runMasterRequirements(prompt);
    const uiRequirements = await this.runUiRequirements(
      JSON.stringify(appRequirements),
    );
    // const pageRequirements = await this.runPageRequirements(
    //   JSON.stringify(uiRequirements),
    // );

    return uiRequirements;
  }

  async runPageRequirements(prompt: string) {
    return this.pageRequirementsAgent.setPrompt(prompt).run();
  }

  async runUiRequirements(prompt: string) {
    return this.uiRequirementsAgent.setPrompt(prompt).run();
  }

  async runMasterRequirements(prompt: string) {
    return this.masterRequrirementsAgent.setPrompt(prompt).run();
  }

  async getPageRequirements() {
    return this.pageRequirementsAgent.getState();
  }

  async getUiRequirements() {
    return this.uiRequirementsAgent.getState();
  }

  async getAppRequirements() {
    return this.masterRequrirementsAgent.getState();
  }
}
