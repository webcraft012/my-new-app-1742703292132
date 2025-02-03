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

@Module({
  imports: [
    AiModule,
    EditorModule,
    FileModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
