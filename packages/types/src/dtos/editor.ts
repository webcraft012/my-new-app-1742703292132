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

export interface EditorState {
  [key: string]: {
    type: {
      resolvedName: string;
    };
    isCanvas: boolean;
    props: Record<string, unknown>;
    displayName: string;
    custom: Record<string, unknown>;
    parent?: string;
    hidden: boolean;
    nodes: string[];
    linkedNodes: {
      [key: string]: string;
    };
  };
}
