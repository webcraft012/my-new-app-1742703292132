import { useNode } from "@craftjs/core";
import React from "react";
import ContentEditable from "react-contenteditable";

interface TextProps {
  color?: string;
  text: string;
  className?: string;
}

export const Text: React.FC<TextProps> = ({ color, text, className }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  // Define a default color for the text, changed from black to gray-800
  const defaultColor = "gray-800";

  // Use the provided color or fall back to the default color
  const textColor = color ? `text-${color}` : `text-${defaultColor}`;

  return (
    <div className="flex items-center">
      <ContentEditable
        className={`${textColor} ${className || ""}`}
        html={text}
        innerRef={(ref) => {
          if (ref) connect(drag(ref));
        }}
        onChange={(e) => {
          // Explicitly make the arrow function return void
          setProp((props: { text: string }) => {
            props.text = e.target.value.replace(/<\/?[^>]+(?:>|$)/g, "");
          });
        }}
        tagName="p"
      />
    </div>
  );
};
