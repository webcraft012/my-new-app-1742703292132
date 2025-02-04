import OpenAI from 'openai';
import { AiClient as AiClientInterface } from '../interfaces/AiClient';
import { z } from 'zod';
import { UIElementSchema } from '../ui-config';
import { zodResponseFormat } from 'openai/helpers/zod';

export class AiClient implements AiClientInterface {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
    });
  }

  async generateContent(
    uiConfig: z.infer<typeof UIElementSchema>,
  ): Promise<string> {
    const completion = await this.client.beta.chat.completions.parse({
      model: 'gpt-4o-2024-11-20',
      messages: [
        {
          role: 'system',
          content:
            'You are a UI generator AI. Convert the user input into a beautiful UI. You always need to wrap components in a row or column inside a container.',
        },
        {
          role: 'user',
          content:
            'Make a Header section where you present a renting car company.',
        },
      ],
      response_format: zodResponseFormat(uiConfig, 'ui'),
    });

    const ui = completion.choices[0].message.parsed;

    return ui;
  }
}
