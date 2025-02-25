import { z } from 'zod';
import { Agent } from './Agent';
import { agentsConfig, AgentsConfigType, AgentType } from './AgentsConfig';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

const model = openrouter('google/gemini-2.0-pro-exp-02-05:free');

export class AgentFactory {
  static createAgent<K extends AgentType>(agentType: K) {
    const agentConfig = agentsConfig[agentType];

    return new Agent<z.infer<AgentsConfigType[K]['outputSchema']>>(
      agentConfig.systemPrompt,
      agentConfig.outputSchema as z.ZodType<
        z.infer<AgentsConfigType[K]['outputSchema']>
      >,
      model,
    );
  }
}
