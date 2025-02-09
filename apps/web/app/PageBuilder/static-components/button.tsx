"use client";

import { forwardRef, PropsWithChildren } from "react";
import FlexContainerComponent from "./container-component";
import TextComponent from "./text";
import { ButtonComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export const ButtonDefaultProps: Partial<ButtonComponentProps> = {
  rounded: "rounded",
  h: "h-12",
  w: "w-auto",
  bg: "bg-blue-500",
  textColor: "text-white",
  fontWeight: "font-bold",
  py: "py-2",
  px: "px-4",
  hover: {
    bg: "bg-blue-600",
  },
};

const ButtonComponent = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonComponentProps>
>((props, ref) => {
  const { textContent, ...rest } = props;

  const computedClassName = getTailwindClassName(rest);

  return (
    <button className={computedClassName} ref={ref}>
      <TextComponent textContent={textContent} />
    </button>
  );
});

ButtonComponent.displayName = "Button";

export default ButtonComponent;
