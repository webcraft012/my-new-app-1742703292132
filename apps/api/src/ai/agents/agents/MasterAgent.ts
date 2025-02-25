import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createAgent } from 'ts-swarm';
import { appConfig, masterAgentPrompt } from '../prompts/MasterAgent';
import { generateObject, generateText, LanguageModel } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});
export const masterAgent = async (userPrompt: string) => {
  return generateObject({
    model: openrouter('google/gemini-2.0-pro-exp-02-05:free'),
    prompt: userPrompt,
    system: masterAgentPrompt,
    schema: appConfig,
    output: 'object',
    mode: 'json',
  });
};
