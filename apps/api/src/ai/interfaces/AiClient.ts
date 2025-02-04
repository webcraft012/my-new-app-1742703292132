import { z } from 'zod';
import { UIElementSchema } from '../ui-config';

/**
 * This is the interface for the AI client.
 * It is used to generate web content.
 * From different components, and defined props the AI client will generate the content.
 */
export interface AiClient {
  generateContent: (config: z.infer<typeof UIElementSchema>) => Promise<string>;
}
