export enum ContainerStyles {
  Card = "card",
  Plain = "plain",
}

export interface ContainerStyleOption {
  label: string;
  value: ContainerStyles;
  class: string;
}

export const containerStylesOptions: ContainerStyleOption[] = [
  {
    class: "rounded-xl overflow-hidden shadow-lg",
    label: "Card",
    value: ContainerStyles.Card,
  },
  {
    class: "",
    label: "Plain",
    value: ContainerStyles.Plain,
  },
];

export const containerStyleClasses: Record<ContainerStyles, { class: string }> =
  containerStylesOptions.reduce(
    (acc, option) => ({ ...acc, [option.value]: { class: option.class } }),
    {} as Record<ContainerStyles, { class: string }>,
  );

export const getContainerStyleClass = (
  containerStyle?: ContainerStyles,
): string => {
  return (
    containerStyle &&
    containerStylesOptions.find((style) => style.value === containerStyle)
      ?.class
  );
};
