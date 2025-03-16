import { z } from 'zod';
import { UIElementSchema } from '../ui-config';
import { UIElement } from '@webcraft/types';

/**
 * This is the interface for the AI client.
 * It is used to generate web content.
 * From different components, and defined props the AI client will generate the content.
 */
export interface AiClient {
  generateContent: () => Promise<UIElement>;
  generateCode: (codeBase: string, prompt: string) => Promise<string>;
}
