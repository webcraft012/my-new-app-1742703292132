import { Inject, Injectable } from '@nestjs/common';
import { AiClient } from './interfaces/AiClient';

@Injectable()
export class AiService {
  constructor(@Inject('AiClient') private aiClient: AiClient) {}

  async generateContent(prompt: string) {
    return this.aiClient.generateContent(prompt);
  }

  async generateCode(requirements: string, codeBase: string, prompt: string) {
    return this.aiClient.generateCode(requirements, codeBase, prompt);
  }
}
