"use client";

import React, { PropsWithChildren } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { FlexContainerProps } from "@webcraft/types";

const defaultClassName = "flex w-full";

const FlexContainerComponent: React.FC<
  PropsWithChildren<FlexContainerProps>
> = (props) => {
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
            typeof width === "number" && width < 100
              ? `${width}%`
              : "calc(100% / var(--num-children))"
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
