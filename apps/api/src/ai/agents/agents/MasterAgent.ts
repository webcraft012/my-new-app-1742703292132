import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { codePrompt } from '../code-prompts/base';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});
export const codeAgent = async (codeBase: string, userPrompt: string) => {
  const prompt = codePrompt(codeBase);
  console.log({ prompt });
  return generateText({
    model: openrouter('google/gemini-2.0-pro-exp-02-05:free'),
    prompt: userPrompt,
    system: prompt,
  });
};
