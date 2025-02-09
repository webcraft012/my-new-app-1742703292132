import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { textSizeOptions } from "@webcraft/types";
import /* Icons for small, medium, large */ "lucide-react";
import React from "react";

export const TextSizeSelector: React.FC<TextSizeSelectorProps> = ({
  defaultValue,
  onChange,
}) => {
  return (
    <div>
      <p className="text-gray-400 font-bold text-xs mb-2">Text Size</p>
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger className="border rounded-xl">
          <SelectValue placeholder="Text Type" />
        </SelectTrigger>
        <SelectContent>
          {textSizeOptions.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface TextSizeSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}
