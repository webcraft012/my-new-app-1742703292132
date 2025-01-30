export interface ColorOptions {
  color: string;
  label: string;
}

export const colorsOptions: ColorOptions[] = [
  {
    color: "unset",
    label: "None",
  },
  {
    color: "#2d2c2c",
    label: "Default",
  },
  {
    color: "#020202",
    label: "Black",
  },
  {
    color: "#ffffff",
    label: "White",
  },
  {
    color: "#d63031",
    label: "Red",
  },
  {
    color: "#55efc4",
    label: "Light Green",
  },
  {
    color: "#0984e3",
    label: "Blue",
  },
  {
    color: "#fdcb6e",
    label: "Yellow",
  },
  {
    color: "#00ffff",
    label: "Cyan",
  },
  {
    color: "#ff00ff",
    label: "Magenta",
  },
  {
    color: "#808080",
    label: "Gray",
  },
  {
    color: "#800000",
    label: "Maroon",
  },
  {
    color: "#808000",
    label: "Olive",
  },
  {
    color: "#008000",
    label: "Green",
  },
  {
    color: "#800080",
    label: "Purple",
  },
  {
    color: "#008080",
    label: "Teal",
  },
  {
    color: "#000080",
    label: "Navy",
  },
];

export const getColorLabel = (color?: string): string => {
  if (!color) return "Default";

  const colorOption = colorsOptions.find((option) => option.color === color);
  return colorOption?.label ?? "Default";
};

export const getColorByLabel = (label: string): string => {
  const colorOption = colorsOptions.find((option) => option.label === label);
  return colorOption?.color ?? "unset";
};

export const makeColorClass = (color: string) => {
  return `text-[${color}]`;
};

export const makeBackgroundColorClass = (color: string) => {
  return `bg-[${color}]`;
};
