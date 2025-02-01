"use client";

import { forwardRef, PropsWithChildren } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import FlexContainerComponent from "./FlexContainer";
import TextComponent from "./text";
import { ButtonComponentProps } from "@webcraft/types";

const defaultClassName =
  "hover:bg-blue-600 text-white font-bold py-2 px-4 rounded h-12 bg-blue-500";

const ButtonComponent = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonComponentProps>
>((props, ref) => {
  const { justify, textColor, backgroundColor, text, className, width } = props;

  const computedClassName = useBuildClassName({
    color: textColor,
    backgroundColor,
    customClassName: `${defaultClassName} ${className}`,
    width,
  });

  return (
    <FlexContainerComponent justify={justify}>
      <button className={computedClassName} ref={ref}>
        <TextComponent text={text} />
      </button>
    </FlexContainerComponent>
  );
});

ButtonComponent.displayName = "Button";

export default ButtonComponent;
