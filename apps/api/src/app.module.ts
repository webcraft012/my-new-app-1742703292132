import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditorService } from './editor/editor.service';
import { EditorModule } from './editor/editor.module';
import { FileModule } from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileController } from './file/file.controller';
import { AiModule } from './ai/ai.module';
import { LogsModule } from './in-memory-logs/logs.module';

import { FileService } from './file/file.service';
import { ApplicationModule } from './application/application.module';
@Module({
  imports: [
    ApplicationModule,
    AiModule,
    LogsModule,
    EditorModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController, FileController],
  providers: [AppService, FileService],
})
export class AppModule {}
