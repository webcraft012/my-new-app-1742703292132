export enum FormatTypes {
  Bold = "bold",
  Italic = "italic",
  Underline = "underline",
  Strikethrough = "strikethrough",
  Subscript = "subscript",
  Code = "code",
}

export interface FormatOptions {
  label: string;
  value: FormatTypes;
  icon: React.JSX.Element;
}

export const formatClasses: Record<FormatTypes, { class: string }> = {
  [FormatTypes.Bold]: { class: "font-bold" },
  [FormatTypes.Italic]: { class: "italic" },
  [FormatTypes.Underline]: { class: "underline" },
  [FormatTypes.Strikethrough]: { class: "line-through" },
  [FormatTypes.Code]: { class: "font-mono" },
  [FormatTypes.Subscript]: { class: "sub" },
};
