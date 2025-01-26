import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
} from "lucide-react";
import React from "react";
import type { JustifyOptions } from "./types";
import { JustifyTypes } from "./types";

const justifyOptions: JustifyOptions[] = [
  {
    label: "Start",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    value: JustifyTypes.Start,
  },
  {
    label: "Center",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: JustifyTypes.Center,
  },
  {
    label: "End",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: JustifyTypes.End,
  },
];

export const JustifySelector: React.FC<JustifySelectorProps> = ({
  onChange,
  defaultValue,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Justify</p>
      <ToggleGroup
        className="border rounded-xl p-1"
        defaultValue={defaultValue}
        onValueChange={onChange}
        type="single"
      >
        {justifyOptions.map((option) => (
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

interface JustifySelectorProps {
  defaultValue?: JustifyTypes;
  onChange?: (value: JustifyTypes) => void;
}
