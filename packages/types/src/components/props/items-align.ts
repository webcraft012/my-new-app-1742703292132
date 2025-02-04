export enum ItemsAlignTypes {
  Start = "items-start",
  Center = "items-center",
  End = "items-end",
}

export interface ItemsAlignOptions {
  label: string;
  value: ItemsAlignTypes;
  icon: any;
}

export const itemsAlignClasses: Record<ItemsAlignTypes, { class: string }> = {
  [ItemsAlignTypes.Start]: { class: "items-start" },
  [ItemsAlignTypes.Center]: { class: "items-center" },
  [ItemsAlignTypes.End]: { class: "items-end" },
};

export const getItemsAlignClass = (align?: ItemsAlignTypes): string => {
  return align && itemsAlignClasses[align]
    ? itemsAlignClasses[align].class
    : "";
};
