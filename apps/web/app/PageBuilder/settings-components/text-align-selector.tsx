import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignJustify,
} from "lucide-react";
import React from "react";

const alignmentOptions = [
  {
    label: "Left",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    value: "text-left",
  },
  {
    label: "Center",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: "text-center",
  },
  {
    label: "Right",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: "text-right",
  },
  {
    label: "Justify",
    icon: <AlignJustify className="h-4 w-4" />,
    value: "text-justify",
  },
];

export const TextAlignmentSelector: React.FC<TextAlignmentSelectorProps> = ({
  onChange,
  defaultValue,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Align</p>
      <ToggleGroup
        className="border rounded-xl p-1"
        defaultValue={defaultValue}
        onValueChange={onChange}
        type="single"
      >
        {alignmentOptions.map((option) => (
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

interface TextAlignmentSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}
