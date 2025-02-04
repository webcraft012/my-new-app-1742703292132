import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EditorService } from './editor/editor.service';
import { EditorModule } from './editor/editor.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [EditorModule, AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
