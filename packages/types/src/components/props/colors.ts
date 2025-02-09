export interface ColorOptions {
  bg: string;
  text: string;
  label: string;
}

export const colorsOptions: ColorOptions[] = [
  {
    bg: "bg-transparent",
    text: "text-transparent",
    label: "None",
  },
  {
    // Approximation for "#2d2c2c"
    bg: "bg-gray-800",
    text: "text-gray-800",
    label: "Default",
  },
  {
    // "#020202" is very dark; using Tailwind’s pure black.
    bg: "bg-black",
    text: "text-black",
    label: "Black",
  },
  {
    bg: "bg-white",
    text: "text-white",
    label: "White",
  },
  {
    // Approximation for "#d63031"
    bg: "bg-red-600",
    text: "text-red-600",
    label: "Red",
  },
  {
    // For "Light Green" we use a bright teal from Tailwind.
    bg: "bg-teal-300",
    text: "text-teal-300",
    label: "Light Green",
  },
  {
    // For "#0984e3" we choose a sky blue.
    bg: "bg-sky-500",
    text: "text-sky-500",
    label: "Blue",
  },
  {
    // Using a warm yellow.
    bg: "bg-yellow-300",
    text: "text-yellow-300",
    label: "Yellow",
  },
  {
    // Approximation for pure cyan.
    bg: "bg-cyan-400",
    text: "text-cyan-400",
    label: "Cyan",
  },
  {
    // Using Tailwind’s fuchsia as the closest built-in to magenta.
    bg: "bg-fuchsia-500",
    text: "text-fuchsia-500",
    label: "Magenta",
  },
  {
    // Approximation for "#808080"
    bg: "bg-gray-500",
    text: "text-gray-500",
    label: "Gray",
  },
  {
    // For maroon, choose a very dark red.
    bg: "bg-red-900",
    text: "text-red-900",
    label: "Maroon",
  },
  {
    // For olive, we use Tailwind’s lime shade as the closest built‑in.
    bg: "bg-lime-700",
    text: "text-lime-700",
    label: "Olive",
  },
  {
    // For classic green (#008000), this is a decent approximation.
    bg: "bg-green-600",
    text: "text-green-600",
    label: "Green",
  },
  {
    // For purple, we choose a darker purple.
    bg: "bg-purple-700",
    text: "text-purple-700",
    label: "Purple",
  },
  {
    // For teal (#008080) we use a darker teal.
    bg: "bg-teal-700",
    text: "text-teal-700",
    label: "Teal",
  },
  {
    // For navy, we pick a very dark blue.
    bg: "bg-blue-900",
    text: "text-blue-900",
    label: "Navy",
  },
];

export const getColorLabel = (color?: string): string => {
  if (!color) return "Default";

  const colorOption = colorsOptions.find(
    (option) => option.bg === color || option.text === color,
  );
  return colorOption?.label ?? "Default";
};

export const getColorByLabel = (label: string): string => {
  const colorOption = colorsOptions.find((option) => option.label === label);
  return colorOption?.bg ?? "unset";
};

export const makeColorClass = (color: string) => {
  return `text-[${color}]`;
};

export const makeBackgroundColorClass = (color: string) => {
  return `bg-[${color}]`;
};
