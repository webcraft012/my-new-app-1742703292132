import { EditorDto, CreateEditorDto, UpdateEditorDto } from '@webcraft/types';

export interface IEditorRepository {
  create(editor: CreateEditorDto): Promise<string>;
  update(id: string, editor: UpdateEditorDto): Promise<void>;
  delete(id: string): Promise<void>;
  findOne(id: string): Promise<EditorDto>;
  findAll(): Promise<EditorDto[]>;
}
