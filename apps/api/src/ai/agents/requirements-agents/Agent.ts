import { z } from 'zod';

import { generateObject, LanguageModel } from 'ai';

export class Agent<T> implements IAgent<T> {
  private state: T;

  private prompt: string;

  constructor(
    private readonly systemPrompt: string,
    private readonly outputSchema: z.ZodSchema<T>,
    private readonly model: LanguageModel,
    prompt?: string,
  ) {
    this.prompt = prompt;
  }

  async run(): Promise<T> {
    const response = await generateObject({
      model: this.model,
      prompt: this.prompt,
      system: this.systemPrompt,
      schema: this.outputSchema,
      output: 'object',
      mode: 'json',
    });

    this.state = response.object;

    return response.object;
  }

  getState(): T {
    return this.state;
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;

    return this;
  }
}

interface IAgent<T> {
  run(prompt: string): Promise<T>;
  getState(): T;
  setPrompt(prompt: string): this;
}
