import { Controller, Get } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private service: AiService) {}

  @Get('generate-content')
  async generateContent() {
    return this.service.generateContent();
  }
}
