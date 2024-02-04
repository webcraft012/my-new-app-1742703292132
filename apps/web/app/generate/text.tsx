"use client";

import React from "react";

interface TextProps {
  text: string;
  color?: string;
  className?: string;
}

const Text: React.FC<TextProps> = ({ color, text, className }) => {
  // Define a default color for the text, changed from black to gray-800
  const defaultColor = "gray-800";

  // Use the provided color or fall back to the default color
  const textColor = color ? `text-${color}` : `text-${defaultColor}`;

  return (
    <div className="flex items-center">
      <p className={`${textColor} ${className || ""}`}>{text}</p>
    </div>
  );
};

export default Text;
