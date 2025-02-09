import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import dotenv from 'dotenv';
import { AiClient } from './client';

dotenv.config();

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'AiClient',
      useFactory: () => new AiClient(process.env.OPEN_AI_API_KEY!),
    },
  ],
  exports: [AiService],
})
export class AiModule {}
