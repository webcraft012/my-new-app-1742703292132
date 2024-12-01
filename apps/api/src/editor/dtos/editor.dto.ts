// Dto describing the editor's data
export class EditorDto {
  id: string;
  name: string;
  description?: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}
