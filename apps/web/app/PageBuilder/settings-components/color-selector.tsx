import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { ColorOptions, colorsOptions, getColorLabel } from "@webcraft/types";
import React, { useState } from "react";

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  onChange,
  defaultValue,
  label = "Color",
  type,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    defaultValue,
  );

  const onColorChange = (value: ColorOptions): void => {
    setSelectedColor(value.bg);
    onChange?.(value[type]);
  };

  return (
    <div>
      <Popover>
        <p className="text-gray-400 font-bold text-xs mb-2">{label}</p>
        <PopoverTrigger className="w-full">
          <div className="flex border rounded-xl p-1 w-full items-center justify-center gap-2">
            <div className={`w-6 h-6 rounded-md ${selectedColor}`} />
            {getColorLabel(selectedColor)}
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex gap-3 flex-wrap">
            {colorsOptions.map((option) => (
              <div className="flex" key="option">
                <button
                  className={`w-8 h-8 rounded-md border ${option.bg} ${
                    selectedColor === option.bg
                      ? "border-blue-400 border-2"
                      : "border-gray-200"
                  } cursor-pointer`}
                  onClick={() => {
                    onColorChange(option);
                  }}
                />
              </div>
            ))}
            <div className="text-sm border h-8 flex py-1 items-center justify-center flex-1 rounded">
              {getColorLabel(selectedColor)}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface ColorSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  type: "bg" | "text";
}
