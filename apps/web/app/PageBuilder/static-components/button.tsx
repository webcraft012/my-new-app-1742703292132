"use client";

import { forwardRef, PropsWithChildren } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import FlexContainerComponent from "./FlexContainer";
import TextComponent from "./text";
import { ButtonComponentProps } from "@webcraft/types";

const defaultClassName =
  "hover:bg-slate-100 text-white font-bold py-2 px-4 rounded h-12";

const ButtonComponent = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonComponentProps>
>((props, ref) => {
  const { justify, textColor, backgroundColor, text, className, width } = props;

  const computedClassName = useBuildClassName({
    justify,
    color: textColor,
    backgroundColor,
    customClassName: `${defaultClassName} ${className}`,
    width,
  });

  return (
    <FlexContainerComponent>
      <button
        className={computedClassName}
        ref={ref}
        style={{
          backgroundColor,
          color: textColor,
        }}
      >
        <TextComponent text={text} />
      </button>
    </FlexContainerComponent>
  );
});

ButtonComponent.displayName = "Button";

export default ButtonComponent;
