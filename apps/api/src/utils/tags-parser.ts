import { XMLParser } from 'fast-xml-parser';

// Define tag types as constants for type checking
export const TagTypes = {
  CREATE_FILE: 'create-file',
  DELETE_FILE: 'delete-file',
  EDIT_FILE: 'edit-file',
  RENAME_FILE: 'rename-file',
  MOVE_FILE: 'move-file',
} as const;

// Type for the tag type values
export type TagType = (typeof TagTypes)[keyof typeof TagTypes];

// Array of allowed tags for validation
const allowedTags = Object.values(TagTypes);

// Parser options
interface ParserOptions {
  stopNodes: string[];
  ignoreAttributes: boolean;
  attributeNamePrefix: string;
  textNodeName: string;
  htmlEntities: boolean;
}

const options: ParserOptions = {
  stopNodes: allowedTags,
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: 'content',
  htmlEntities: false,
};

// Base interface for all tag results
interface BaseTagResult {
  type: TagType;
}

// Path-related tags (common property)
interface PathBasedTag extends BaseTagResult {
  path: string;
}

// Content-related tags (common property)
interface ContentBasedTag extends PathBasedTag {
  content: string;
}

// Path-transformation tags (common properties)
interface PathTransformationTag extends BaseTagResult {
  oldPath: string;
  newPath: string;
}

// Specific tag type interfaces
export interface CreateFileTag extends ContentBasedTag {
  type: typeof TagTypes.CREATE_FILE;
}

export interface DeleteFileTag extends PathBasedTag {
  type: typeof TagTypes.DELETE_FILE;
}

export interface EditFileTag extends ContentBasedTag {
  type: typeof TagTypes.EDIT_FILE;
  startLine: number;
  endLine: number;
}

export interface RenameFileTag extends PathTransformationTag {
  type: typeof TagTypes.RENAME_FILE;
}

export interface MoveFileTag extends PathTransformationTag {
  type: typeof TagTypes.MOVE_FILE;
}

// Union type for all possible tag results
export type XmlTagResult =
  | CreateFileTag
  | DeleteFileTag
  | EditFileTag
  | RenameFileTag
  | MoveFileTag;

// Raw parsed tag structures
interface RawCreateFileTag {
  'create-file': {
    content: string;
    path: string;
  };
}

interface RawDeleteFileTag {
  'delete-file': {
    path: string;
  };
}

interface RawEditFileTag {
  'edit-file': {
    content: string;
    path: string;
    startLine: number;
    endLine: number;
  };
}

interface RawRenameFileTag {
  'rename-file': {
    oldPath: string;
    newPath: string;
  };
}

interface RawMoveFileTag {
  'move-file': {
    oldPath: string;
    newPath: string;
  };
}

// Union type for raw parser results
type RawXmlTagResult =
  | RawCreateFileTag
  | RawDeleteFileTag
  | RawEditFileTag
  | RawRenameFileTag
  | RawMoveFileTag;

export const parseXmlTags = (input: string): { operations: XmlTagResult[] } => {
  const operations: XmlTagResult[] = [];

  // Define regex patterns that capture tag types and important attributes
  const createFilePattern =
    /<create-file\s+(?:path="([^"]*)")?\s*>([\s\S]*?)<\/create-file>/g;
  const deleteFilePattern =
    /<delete-file\s+(?:path="([^"]*)")?\s*>([\s\S]*?)<\/delete-file>/g;
  const editFilePattern =
    /<edit-file\s+(?:path="([^"]*)")?\s*(?:startLine="(\d+)")?\s*(?:endLine="(\d+)")?\s*>([\s\S]*?)<\/edit-file>/g;
  const renameFilePattern =
    /<rename-file\s+(?:oldPath="([^"]*)")?\s*(?:newPath="([^"]*)")?\s*>([\s\S]*?)<\/rename-file>/g;
  const moveFilePattern =
    /<move-file\s+(?:oldPath="([^"]*)")?\s*(?:newPath="([^"]*)")?\s*>([\s\S]*?)<\/move-file>/g;

  // Extract create-file tags
  let match;
  while ((match = createFilePattern.exec(input)) !== null) {
    const path = match[1] || '';
    const content = match[2] || '';

    operations.push({
      type: TagTypes.CREATE_FILE,
      path,
      content,
    });
  }

  // Extract delete-file tags
  while ((match = deleteFilePattern.exec(input)) !== null) {
    const path = match[1] || '';

    operations.push({
      type: TagTypes.DELETE_FILE,
      path,
    });
  }

  // Extract edit-file tags
  while ((match = editFilePattern.exec(input)) !== null) {
    const path = match[1] || '';
    const startLine = match[2] ? parseInt(match[2], 10) : 0;
    const endLine = match[3] ? parseInt(match[3], 10) : 0;
    const content = match[4] || '';

    operations.push({
      type: TagTypes.EDIT_FILE,
      path,
      startLine,
      endLine,
      content,
    });
  }

  // Extract rename-file tags
  while ((match = renameFilePattern.exec(input)) !== null) {
    const oldPath = match[1] || '';
    const newPath = match[2] || '';

    operations.push({
      type: TagTypes.RENAME_FILE,
      oldPath,
      newPath,
    });
  }

  // Extract move-file tags
  while ((match = moveFilePattern.exec(input)) !== null) {
    const oldPath = match[1] || '';
    const newPath = match[2] || '';

    operations.push({
      type: TagTypes.MOVE_FILE,
      oldPath,
      newPath,
    });
  }

  return { operations };
};
