"use client";

import type { ReactNode } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { JustifyTypes, WidthTypes } from "../settings-components";

export interface FlexContainerProps {
  className?: string;
  children?: ReactNode;
  width?: WidthTypes;
  justify?: JustifyTypes;
  backgroundColor?: string;
}

const defaultClassName = "flex w-full";

const FlexContainerComponent = (props) => {
  const { children, className, width, justify, backgroundColor } = props;

  const computedClassName = useBuildClassName({
    customClassName: `${defaultClassName} ${className ?? ""}`,
    width,
    justify,
    backgroundColor,
  });

  return (
    <div
      className={computedClassName}
      style={
        {
          "--width": `${
            width < 100 ? `${width}%` : "calc(100% / var(--num-children))"
          }`,
          // flexBasis: `${`${width || 100}%`} !important`,
          "--gap-total-width": "calc(8px * (var(--num-children) - 1))",
          flexBasis: "calc(var(--width) - var(--gap-total-width))",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

FlexContainerComponent.displayName = "FlexContainer";

export default FlexContainerComponent;
