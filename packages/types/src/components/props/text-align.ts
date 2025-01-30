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

export const alignmentClasses: Record<AlignmentTypes, { class: string }> = {
  [AlignmentTypes.Left]: { class: "text-left" },
  [AlignmentTypes.Center]: { class: "text-center" },
  [AlignmentTypes.Right]: { class: "text-right" },
  [AlignmentTypes.Justify]: { class: "text-justify" },
};

export const getAlignmentClass = (align?: AlignmentTypes): string => {
  return align && alignmentClasses[align] ? alignmentClasses[align].class : "";
};
