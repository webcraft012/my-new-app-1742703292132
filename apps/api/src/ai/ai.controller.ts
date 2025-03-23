import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private service: AiService) {}

  @Get('generate-content')
  async generateContent(@Query('prompt') prompt: string) {
    return this.service.generateContent(prompt);
  }
}
