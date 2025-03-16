import { Inject, Injectable } from '@nestjs/common';
import { AiClient } from './interfaces/AiClient';

@Injectable()
export class AiService {
  constructor(@Inject('AiClient') private aiClient: AiClient) {}

  async generateContent() {
    return this.aiClient.generateContent();
  }

  async generateCode(codeBase: string, prompt: string) {
    return this.aiClient.generateCode(codeBase, prompt);
  }
}
