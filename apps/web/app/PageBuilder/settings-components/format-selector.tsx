import { Bold, Code, Italic, Strikethrough, Underline } from "lucide-react";
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import { FormatTypes, type FormatOptions } from "./types";

const formatOptions: FormatOptions[] = [
  {
    label: "Bold",
    icon: <Bold className="h-4 w-4" />,
    value: FormatTypes.Bold,
  },
  {
    label: "Italic",
    icon: <Italic className="h-4 w-4" />,
    value: FormatTypes.Italic,
  },
  {
    label: "Underline",
    icon: <Underline className="h-4 w-4" />,
    value: FormatTypes.Underline,
  },
  {
    label: "Strikethrough",
    icon: <Strikethrough className="h-4 w-4" />,
    value: FormatTypes.Strikethrough,
  },
  {
    label: "Code",
    icon: <Code className="h-4 w-4" />,
    value: FormatTypes.Code,
  },
];

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  defaultValues,
  onChange,
}) => {
  console.log({ defaultValues });
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Text format</p>
      <ToggleGroup
        className="border rounded-xl p-1"
        defaultValue={defaultValues}
        onValueChange={onChange}
        type="multiple"
      >
        {formatOptions.map((option) => (
          <ToggleGroupItem
            aria-label={option.label}
            key={option.value}
            value={option.value}
          >
            {option.icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

interface FormatSelectorProps {
  defaultValues?: FormatTypes[];
  onChange?: (values: FormatTypes[]) => void;
}
