import { LanguageModel } from 'ai';
import { Agent } from './Agent';
import {
  CodingAgentsConfigType,
  CodingAgent,
  getAgentSystemPrompt,
} from './AgentsConfig';
// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { createGroq } from '@ai-sdk/groq';

// const google = createGoogleGenerativeAI({
//   // custom settings
// });

// const groq = createGroq({});
import { deepseek } from '@ai-sdk/deepseek';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

// const model = openrouter('deepseek/deepseek-r1');
const model = deepseek('deepseek-reasoner');
// const model = google('gemini-2.0-pro-exp-02-05');
// const model = groq('deepseek-r1-distill-llama-70b');

export class CodingAgentFactory {
  static createAgent<K extends CodingAgent>(
    agentConfig: CodingAgentsConfigType[K],
  ) {
    const systemPrompt = getAgentSystemPrompt(agentConfig.type, agentConfig);

    return new Agent(
      systemPrompt,
      model as LanguageModel,
      agentConfig.tools,
      undefined,
      agentConfig.toolRequired,
    );
  }
}
