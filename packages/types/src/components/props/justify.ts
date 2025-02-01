export enum JustifyTypes {
  Start = "start",
  Center = "center",
  End = "end",
}

export interface JustifyOptions {
  label: string;
  value: JustifyTypes;
  icon: any;
}

export const justifyClasses: Record<JustifyTypes, { class: string }> = {
  [JustifyTypes.Start]: { class: "justify-start" },
  [JustifyTypes.Center]: { class: "justify-center" },
  [JustifyTypes.End]: { class: "justify-end" },
};

export const getJustifyClass = (justify?: JustifyTypes): string => {
  return justify && justifyClasses[justify]
    ? justifyClasses[justify].class
    : "";
};
