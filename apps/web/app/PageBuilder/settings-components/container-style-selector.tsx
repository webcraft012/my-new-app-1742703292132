import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import /* Icons for small, medium, large */ "lucide-react";
import React from "react";
import type { ContainerStyles } from "./types";
import { containerStylesOptions } from "./types";

export const ContainerStyleSelector: React.FC<ContainerStyleSelectorProps> = ({
  defaultValue,
  onChange,
}) => {
  return (
    <div className="w-full">
      <p className="text-gray-400 font-bold text-xs mb-2">Container Style</p>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="border rounded-xl w-full">
          <SelectValue placeholder="Container Style" />
        </SelectTrigger>
        <SelectContent>
          {containerStylesOptions.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface ContainerStyleSelectorProps {
  defaultValue?: ContainerStyles;
  onChange?: (value: ContainerStyles) => void;
}
