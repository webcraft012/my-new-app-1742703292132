import { CreateEditorDto, UpdateEditorDto } from '../dtos/editor.dto';
import { Editor } from './editor';

export interface IEditorRepository {
  create(editor: CreateEditorDto): Promise<string>;
  update(id: string, editor: UpdateEditorDto): Promise<void>;
  delete(id: string): Promise<void>;
  findOne(id: string): Promise<Editor>;
  findAll(): Promise<Editor[]>;
}
