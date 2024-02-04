"use client";

import type { ReactNode } from "react";
import React from "react";
import Text from "./text";

interface ButtonProps {
  defaultClassName?: string;
  className?: string;
  children?: ReactNode;
  text: string;
  width?: number;
}

const Button: React.FC<ButtonProps> = ({
  defaultClassName = "bg-gray-800 text-white px-4 py-2 rounded-md",
  text,
  className,
  width,
}) => {
  return (
    <div
      className="flex flex-1"
      style={
        {
          "--width": `${width || 100}%`,
          // flexBasis: `${`${width || 100}%`} !important`,
          "--gap-total-width": "calc(8px * (var(--num-children) - 1))",
          flexBasis: "calc(var(--width) - var(--gap-total-width))",
        } as React.CSSProperties
      }
    >
      <button
        className={`${defaultClassName} ${className}`}
        onClick={() => {
          console.log("Clicked");
        }}
      >
        <Text text={text} />
      </button>
    </div>
  );
};

export default Button;
