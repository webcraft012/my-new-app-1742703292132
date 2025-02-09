import type { FC } from "react";
import React from "react";
import { useNode } from "@craftjs/core";
import ButtonComponent, {
  ButtonDefaultProps,
} from "../../static-components/button";
import { ButtonSettings } from "./settings";
import { ButtonComponentProps } from "@webcraft/types";

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

export const Button: CraftButton = (props) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <ButtonComponent
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      {...props}
    ></ButtonComponent>
  );
};

Button.craft = {
  props: {
    ...ButtonDefaultProps,
    text: "Click me",
  },
  related: {
    settings: ButtonSettings,
  },
};

export default Button;
