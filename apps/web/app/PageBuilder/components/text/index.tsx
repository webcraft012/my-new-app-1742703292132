import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React from "react";
import { TextSettings } from "./settings";
import TextComponent from "../../static-components/text";
import {
  AlignmentTypes,
  getColorByLabel,
  TextTypes,
} from "../../settings-components";
import { TextComponentProps } from "@webcraft/types";

export interface TextProps extends TextComponentProps {}

export const Text: UserComponent<TextProps> = ({
  textAlign,
  backgroundColor,
  color,
  text,
  textFormats,
  textType,
  className,
}) => {
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
        setProp((props: { text: string }) => {
          props.text = e.target.value.replace(/<\/?[^>]+(?:>|$)/g, "");
        });
      }}
      text={text}
      textAlign={textAlign}
      textFormats={textFormats}
      textType={textType}
      isEditable={true}
      className={className}
      color={color}
      backgroundColor={backgroundColor}
    />
  );
};

Text.craft = {
  props: {
    textAlign: AlignmentTypes.Left,
    color: getColorByLabel("Black"),
    textType: TextTypes.Parahraph,
  },
  related: {
    settings: TextSettings,
  },
};
