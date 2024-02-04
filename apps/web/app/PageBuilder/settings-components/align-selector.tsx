import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignJustify,
} from "lucide-react";
import React from "react";
import type { AlignmentOptions } from "./types";
import { AlignmentTypes } from "./types";

const alignmentOptions: AlignmentOptions[] = [
  {
    label: "Left",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    value: AlignmentTypes.Left,
  },
  {
    label: "Center",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: AlignmentTypes.Center,
  },
  {
    label: "Right",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: AlignmentTypes.Right,
  },
  {
    label: "Justify",
    icon: <AlignJustify className="h-4 w-4" />,
    value: AlignmentTypes.Justify,
  },
];

export const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({
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

interface AlignmentSelectorProps {
  defaultValue?: AlignmentTypes;
  onChange?: (value: AlignmentTypes) => void;
}
