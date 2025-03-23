import { Tool } from 'ai';
import { Agent } from './Agent';
import {
  CodingAgentsConfigType,
  CodingAgent,
  getAgentSystemPrompt,
} from './AgentsConfig';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

const model = openrouter('google/gemini-2.0-pro-exp-02-05:free');

export class CodingAgentFactory {
  static createAgent<K extends CodingAgent>(
    agentConfig: CodingAgentsConfigType[K],
  ) {
    const systemPrompt = getAgentSystemPrompt(agentConfig.type, agentConfig);

    return new Agent(systemPrompt, model, agentConfig.tools);
  }
}
