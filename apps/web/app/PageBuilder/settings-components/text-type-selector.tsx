import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import /* Icons for small, medium, large */ "lucide-react";
import React from "react";
import type { TextTypes } from "./types";
import { textTypesOptions } from "./types";

export const TextTypeSelector: React.FC<TextTypeSelectorProps> = ({
  defaultValue,
  onChange,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Text Type</p>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="border rounded-xl">
          <SelectValue placeholder="Text Type" />
        </SelectTrigger>
        <SelectContent>
          {textTypesOptions.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface TextTypeSelectorProps {
  defaultValue?: TextTypes;
  onChange?: (value: TextTypes) => void;
}
