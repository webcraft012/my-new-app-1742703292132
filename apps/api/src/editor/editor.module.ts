import { Module } from '@nestjs/common';
import { EditorController } from './editor.controller';
import { EditorService } from './editor.service';
import { EditorRepository } from './repositories/editor.repository';
import { databaseClient } from '../database';

@Module({
  controllers: [EditorController],
  providers: [
    EditorService,
    {
      provide: 'IEditorRepository',
      useClass: EditorRepository,
    },
    {
      provide: 'DatabaseClient',
      useValue: databaseClient,
    },
  ],
})
export class EditorModule {}
