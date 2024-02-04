import type { FC } from "react";
import React from "react";
import { useNode } from "@craftjs/core";
import { Text } from "../text";
import ButtonComponent from "../../static-components/button";
import { ButtonSettings } from "./settings";

export interface ButtonProps {
  align?: string;
  textColor?: string;
  backgroundColor?: string;
  color?: string;
  text: string;
  defaultClassName?: string;
  className?: string;
  width?: string;
}

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
  align,
  textColor,
  backgroundColor,
  text,
  defaultClassName,
  className,
  width,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <ButtonComponent
      align={align}
      backgroundColor={backgroundColor}
      className={`${className} ${width}`}
      defaultClassName={defaultClassName}
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      textColor={textColor}
    >
      <Text text={text} />
    </ButtonComponent>
  );
};

Button.craft = {
  props: {
    align: "justify-start",
    backgroundColor: "#0984e3",
    defaultClassName:
      "hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-12",
    text: "My Button",
    textColor: "#ffffff",
    width: "w-auto",
  },
  related: {
    settings: ButtonSettings,
  },
};

export default Button;
