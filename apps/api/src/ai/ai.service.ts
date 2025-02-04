import { Inject, Injectable } from '@nestjs/common';
import { AiClient } from './interfaces/AiClient';
import { UIElementSchema } from './ui-config';

@Injectable()
export class AiService {
  constructor(@Inject('AiClient') private aiClient: AiClient) {}

  async generateContent() {
    return this.aiClient.generateContent(UIElementSchema);
  }
}
