import { generateText, LanguageModel, Tool } from 'ai';

export class Agent implements IAgent {
  private prompt: string;

  constructor(
    private readonly systemPrompt: string,
    private readonly model: LanguageModel,
    private readonly tools: Record<string, Tool>,
    prompt?: string,
    private readonly toolRequired?: boolean,
  ) {
    this.prompt = prompt;
  }

  async run(): Promise<string> {
    const response = await generateText({
      model: this.model,
      prompt: this.prompt,
      system: this.systemPrompt,
      tools: this.tools,
      maxSteps: 10,
      toolChoice: this.toolRequired ? 'required' : 'auto',
    });

    // console.log(JSON.stringify(response, null, 2));

    return response.text;
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;

    return this;
  }
}

interface IAgent {
  run(prompt: string): Promise<string>;
  setPrompt(prompt: string): this;
}
