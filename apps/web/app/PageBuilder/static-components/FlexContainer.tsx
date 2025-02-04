"use client";

import React, { forwardRef, PropsWithChildren } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { FlexContainerProps } from "@webcraft/types";

const defaultClassName = "flex w-full";

const FlexContainerComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<FlexContainerProps>
>((props, ref) => {
  const { children, className, width, justify, backgroundColor, style } = props;

  const computedClassName = useBuildClassName({
    customClassName: `${defaultClassName} ${className ?? ""}`,
    width,
    justify,
    backgroundColor,
  });

  console.log({
    width,
  });

  return (
    <div
      className={computedClassName}
      style={
        {
          "--width": `${
            width && Number(width) < 100
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
});

FlexContainerComponent.displayName = "FlexContainer";

export default FlexContainerComponent;
