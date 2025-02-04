export enum FormatTypes {
  Bold = "font-bold",
  Italic = "italic",
  Underline = "underline",
  Strikethrough = "line-through",
  Subscript = "sub",
  Code = "font-mono",
}

export interface FormatOptions {
  label: string;
  value: FormatTypes;
  icon: any;
}

export const formatClasses: Record<FormatTypes, { class: string }> = {
  [FormatTypes.Bold]: { class: "font-bold" },
  [FormatTypes.Italic]: { class: "italic" },
  [FormatTypes.Underline]: { class: "underline" },
  [FormatTypes.Strikethrough]: { class: "line-through" },
  [FormatTypes.Code]: { class: "font-mono" },
  [FormatTypes.Subscript]: { class: "sub" },
};
