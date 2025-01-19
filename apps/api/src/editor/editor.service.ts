import { Inject, Injectable } from '@nestjs/common';
import { IEditorRepository } from './types/editor.repository';
import { CreateEditorDto, UpdateEditorDto, EditorDto } from '@webcraft/types';

@Injectable()
export class EditorService {
  constructor(
    @Inject('IEditorRepository') private repository: IEditorRepository,
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
}
