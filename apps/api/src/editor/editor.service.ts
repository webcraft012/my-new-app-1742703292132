import { Injectable } from '@nestjs/common';
import { IEditorRepository } from './types/editor.repository';
import { Editor } from './types/editor';

@Injectable()
export class EditorService {
  constructor(private repository: IEditorRepository) {}

  async create(editor: Editor) {
    return this.repository.create(editor);
  }

  async update(editor: Editor) {
    return this.repository.update(editor);
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
}
