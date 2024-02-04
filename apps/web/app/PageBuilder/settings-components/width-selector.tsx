import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import /* Icons for small, medium, large */ "lucide-react";
import React from "react";
import type { WidthOptions } from "./types";
import { WidthTypes } from "./types";

const widthOptions: WidthOptions[] = [
  {
    label: "Auto",
    value: WidthTypes.Auto,
  },
  {
    label: "Full",
    value: WidthTypes.Full,
  },
];

export const WidthSelector: React.FC<WidthSelectorProps> = ({
  defaultValue,
  onChange,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Width</p>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Width" />
        </SelectTrigger>
        <SelectContent>
          {widthOptions.map((width) => (
            <SelectItem key={width.value} value={width.value}>
              {width.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface WidthSelectorProps {
  defaultValue?: WidthTypes;
  onChange?: (value: WidthTypes) => void;
}
