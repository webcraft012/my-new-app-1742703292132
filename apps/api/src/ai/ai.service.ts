import { Inject, Injectable } from '@nestjs/common';
import { AiClient } from './interfaces/AiClient';
import { CodeGenerationManager } from 'src/managers';
@Injectable()
export class AiService {
  constructor(@Inject('AiClient') private aiClient: AiClient) {}

  async generateCode(
    codeGenerationManager: CodeGenerationManager,
    prompt: string,
  ) {
    return this.aiClient.generateCode(codeGenerationManager, prompt);
  }
}
