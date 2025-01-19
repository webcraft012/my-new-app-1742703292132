// Dto describing the editor's data
export class EditorDto {
  id: string;
  name: string;
  description?: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateEditorDto {
  name: string;
  description?: string;
  state: string;
}

export class UpdateEditorDto extends CreateEditorDto {}
