import { Editor } from './editor';

export interface IEditorRepository {
  create(editor: Editor): Promise<Editor>;
  update(editor: Editor): Promise<Editor>;
  delete(id: string): Promise<void>;
  findOne(id: string): Promise<Editor>;
  findAll(): Promise<Editor[]>;
}
