import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import /* Icons for small, medium, large */ "lucide-react";
import React from "react";

const widthOptions = [
  {
    label: "Auto",
    value: "w-auto",
  },
  {
    label: "Full",
    value: "w-full",
  },
  {
    label: "Min",
    value: "w-min",
  },
  {
    label: "Max",
    value: "w-max",
  },
  {
    label: "Fit",
    value: "w-fit",
  },
];

export const WidthSelector: React.FC<WidthSelectorProps> = ({
  defaultValue,
  onChange,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Width</p>
      <Select defaultValue={`${defaultValue}`} onValueChange={onChange}>
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
  defaultValue?: string;
  onChange?: (value: string) => void;
}
