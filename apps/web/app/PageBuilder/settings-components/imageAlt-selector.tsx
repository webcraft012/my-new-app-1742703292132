"use client";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { useState } from "react";
export const ImageAltSelector: React.FC<ImageAltSelectorProps> = ({
  onChange,
  defaultValue,
}) => {
  const [openInput, setOpenInput] = useState(false);
  const handleOpenInput = () => {
    setOpenInput(true);
  };
  return (
    <>
      {openInput ? (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            value={defaultValue}
            onChange={(e) => {
              onChange?.(e.target.value);
            }}
            placeholder="Describe your image here"
          />
          <Button
            type="submit"
            onClick={() => {
              setOpenInput(false);
            }}
            className="bg-white text-gray-300 border-2  hover:bg-gray-50 w-[50px]"
          >
            Save
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleOpenInput}
          className="bg-white text-black border-2 w-[200px] hover:bg-gray-50 text-sm"
        >
          Add Alt Text
        </Button>
      )}
    </>
  );
};

interface ImageAltSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}
