export enum AlignmentTypes {
  Left = "left",
  Center = "center",
  Right = "right",
  Justify = "justify",
}

export interface AlignmentOptions {
  label: string;
  value: AlignmentTypes;
  icon: React.JSX.Element;
}
