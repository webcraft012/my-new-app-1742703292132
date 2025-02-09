import { ToggleGroup, ToggleGroupItem } from "@ui/components/ui/toggle-group";
import {
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignJustify,
  AlignHorizontalJustifyEnd,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
} from "lucide-react";
import React from "react";

const justifyOptions = [
  {
    label: "Start",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    value: "justify-start",
  },
  {
    label: "Center",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    value: "justify-center",
  },
  {
    label: "End",
    icon: <AlignHorizontalJustifyEnd className="h-4 w-4" />,
    value: "justify-end",
  },
  {
    label: "Between",
    icon: <AlignHorizontalSpaceBetween className="h-4 w-4" />,
    value: "justify-between",
  },
  {
    label: "Around",
    icon: <AlignHorizontalSpaceAround className="h-4 w-4" />,
    value: "justify-around",
  },
  {
    label: "Evenly",
    icon: <AlignJustify className="h-4 w-4" />,
    value: "justify-evenly",
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
  defaultValue?: string;
  onChange?: (value: string) => void;
}
