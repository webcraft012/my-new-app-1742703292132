import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React from "react";
import ContentEditable from "react-contenteditable";
import { TextSettings } from "./settings";

export interface TextProps {
  align?: string;
  backgroundColor?: string;
  className?: string;
  color?: string;
  format?: string;
  text: string;
  transform?: string;
  type?: string;
}

export const Text: UserComponent<TextProps> = ({
  align,
  backgroundColor,
  color,
  text,
  format,
  className,
  type,
}) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  return (
    <div
      className="flex items-center"
      style={{
        backgroundColor,
      }}
    >
      <ContentEditable
        className={`${format || ""} ${align || ""} ${className || ""} ${
          type || ""
        } w-full`}
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
        style={{
          color,
        }}
        tagName="p"
      />
    </div>
  );
};

Text.craft = {
  props: {
    align: "text-left",
    color: "#2d2c2c",
    type: "text-base",
  },
  related: {
    settings: TextSettings,
  },
};
