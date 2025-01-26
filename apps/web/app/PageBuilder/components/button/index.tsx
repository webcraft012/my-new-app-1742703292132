import type { FC } from "react";
import React from "react";
import { useNode } from "@craftjs/core";
import { Text } from "../text";
import ButtonComponent, {
  ButtonComponentProps,
} from "../../static-components/button";
import { ButtonSettings } from "./settings";
import {
  getColorByLabel,
  JustifyTypes,
  WidthTypes,
} from "../../settings-components";

export interface ButtonProps extends ButtonComponentProps {}

// Define a type for the component with the 'craft' property
interface CraftButton extends FC<ButtonProps> {
  craft: {
    props: ButtonProps;
    related: {
      settings: React.ComponentType<React.FC>;
    };
  };
}

export const Button: CraftButton = ({
  justify,
  textColor,
  backgroundColor,
  text,
  className,
  width,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <ButtonComponent
      justify={justify}
      backgroundColor={backgroundColor}
      width={width}
      className={className}
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      textColor={textColor}
      text={text}
    ></ButtonComponent>
  );
};

Button.craft = {
  props: {
    justify: JustifyTypes.Start,
    backgroundColor: getColorByLabel("Blue"),
    text: "My Button",
    textColor: getColorByLabel("White"),
    width: WidthTypes.Auto,
  },
  related: {
    settings: ButtonSettings,
  },
};

export default Button;
