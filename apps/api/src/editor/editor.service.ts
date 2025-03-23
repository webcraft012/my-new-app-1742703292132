import { Inject, Injectable } from '@nestjs/common';
import { IEditorRepository } from './types/editor.repository';
import {
  CreateEditorDto,
  UpdateEditorDto,
  EditorDto,
  UIElement,
  EditorState,
  uiElementMapWithComponentName,
} from '@webcraft/types';
import { EditorBuilder } from './editor-builder';
import { AiService } from 'src/ai/ai.service';

@Injectable()
export class EditorService {
  constructor(
    @Inject('IEditorRepository') private repository: IEditorRepository,
    private aiService: AiService,
  ) {}

  async create(editor: CreateEditorDto) {
    return this.repository.create(editor);
  }

  async update(id: string, editor: UpdateEditorDto) {
    return this.repository.update(id, editor);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async buildEditor() {
    // const generatedUIElements = await this.aiService.generateContent();
    // return generatedUIElements;
    // console.log(typeof generatedUIElements);
    // const editorBuilder = new EditorBuilder();
    // const editorState = editorBuilder.buildEditor(
    //   generatedUIElements as unknown as UIElement,
    // );
    // console.log('HEREEE');
    // console.log(editorState);
    // const editor = await this.findOne('af9a001974655fc48685d003525a3584');
    // await this.update(editor.id, {
    //   name: editor.name,
    //   state: JSON.stringify(editorState),
    // });
    // return editorState;
  }
}
