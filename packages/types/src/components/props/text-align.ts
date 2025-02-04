export enum AlignmentTypes {
  Left = "text-left",
  Center = "text-center",
  Right = "text-right",
  Justify = "text-justify",
}

export interface AlignmentOptions {
  label: string;
  value: AlignmentTypes;
  icon: any;
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
