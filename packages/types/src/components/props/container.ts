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
