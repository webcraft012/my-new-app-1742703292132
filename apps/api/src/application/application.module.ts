import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './repositories/application.repository';
import { databaseClient } from '../database';
import { AiModule } from 'src/ai/ai.module';
import { LogsModule } from 'src/in-memory-logs/logs.module';

@Module({
  imports: [AiModule, LogsModule],
  controllers: [ApplicationController],
  providers: [
    ApplicationService,
    {
      provide: 'IApplicationRepository',
      useClass: ApplicationRepository,
    },
    {
      provide: 'DatabaseClient',
      useValue: databaseClient,
    },
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
