import { Module } from '@nestjs/common';
import { InMemoryLogsDB } from '../utils/in-memory-logs-db';

@Module({
  providers: [InMemoryLogsDB],
  exports: [InMemoryLogsDB],
})
export class LogsModule {}
