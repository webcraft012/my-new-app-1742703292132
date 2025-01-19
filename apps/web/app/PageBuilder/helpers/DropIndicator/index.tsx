import React from "react";

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  className,
  type = "column",
}) => {
  return (
    <div
      className={`${
        type === "column" ? "w-4 h-full" : "w-full h-6"
      }  bg-blue-200 absolute ${className} opacity-0`}
      onDragOver={(e) => {
        e.preventDefault();
        e.currentTarget.style.opacity = "0.5";
      }}
      onDragLeave={(e) => {
        e.currentTarget.style.opacity = "0";
      }}
    ></div>
  );
};

interface DropIndicatorProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "row" | "column";
}
