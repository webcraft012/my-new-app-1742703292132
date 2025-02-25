import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createAgent } from 'ts-swarm';
import { appConfig } from '../prompts/MasterAgent';
import { uiAgentPrompt, uiConfig } from '../prompts/UiAgents';
import { generateObject, generateText, LanguageModel } from 'ai';
import { z } from 'zod';
import dedent from 'dedent';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});
export const uiAgent = async (config: z.infer<typeof appConfig>) => {
  return generateObject({
    model: openrouter('google/gemini-2.0-pro-exp-02-05:free'),
    prompt: `**App requirements:** ${JSON.stringify(config)}`,
    system: uiAgentPrompt,
    schema: uiConfig,
    output: 'object',
    mode: 'json',
  });
};
