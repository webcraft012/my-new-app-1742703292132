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
