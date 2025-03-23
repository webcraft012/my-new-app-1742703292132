import { z } from 'zod';
import { pageStructureAgentSchema } from '../agents/requirements-agents/prompts';

/**
 * This is the interface for the AI client.
 * It is used to generate web content.
 * From different components, and defined props the AI client will generate the content.
 */
export interface AiClient {
  generateContent: (
    prompt: string,
  ) => Promise<z.infer<typeof pageStructureAgentSchema>[]>;
  generateCode: (
    requirements: string,
    codeBase: string,
    prompt: string,
  ) => Promise<string>;
}
