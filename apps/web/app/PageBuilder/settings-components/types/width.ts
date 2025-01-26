export enum WidthTypes {
  Auto = "auto",
  Full = "full",
}

export interface WidthOptions {
  label: string;
  value: WidthTypes;
}

export const widthOptions: Record<WidthTypes, { class: string }> = {
  [WidthTypes.Auto]: { class: "w-auto" },
  [WidthTypes.Full]: { class: "flex w-full" },
};
