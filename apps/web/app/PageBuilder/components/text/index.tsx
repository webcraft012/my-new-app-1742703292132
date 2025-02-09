import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React from "react";
import { TextSettings } from "./settings";
import TextComponent from "../../static-components/text";

import { TextComponentProps } from "@webcraft/types";

export interface TextProps extends TextComponentProps {}

export const Text: UserComponent<TextProps> = ({ textContent, ...props }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  return (
    <TextComponent
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      onChange={(e) => {
        // Explicitly make the arrow function return void
        setProp((props: { textContent: string }) => {
          props.textContent = e.target.value.replace(/<\/?[^>]+(?:>|$)/g, "");
        });
      }}
      textContent={textContent}
      isEditable={true}
      {...props}
    />
  );
};

Text.craft = {
  props: {
    textAlign: "text-left",
    textColor: "text-black",
    fontSize: "text-base",
  },
  related: {
    settings: TextSettings,
  },
};
