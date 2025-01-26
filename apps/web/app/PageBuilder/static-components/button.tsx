"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { JustifyTypes, WidthTypes } from "../settings-components";
import FlexContainerComponent from "./FlexContainer";
import TextComponent from "./text";

export interface ButtonComponentProps {
  justify?: JustifyTypes;
  textColor?: string;
  backgroundColor?: string;
  color?: string;
  className?: string;
  width?: WidthTypes;
  text: string;
}

const defaultClassName =
  "hover:bg-slate-100 text-white font-bold py-2 px-4 rounded h-12";

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (props, ref) => {
    const { justify, textColor, backgroundColor, text, className, width } =
      props;

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
  },
);

ButtonComponent.displayName = "Button";

export default ButtonComponent;
