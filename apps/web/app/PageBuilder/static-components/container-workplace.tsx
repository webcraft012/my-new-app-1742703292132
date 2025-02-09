"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { ContainerProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export const ContainerWorkplaceDefaultProps: Partial<ContainerProps> = {
  display: "flex",
  flexDirection: "flex-col",
  gap: "gap-4",
  position: "relative",
  // flexWrap: "flex-wrap",
};

const ContainerWorkplaceComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContainerProps>
>((props, ref) => {
  const mergedProps = { ...ContainerWorkplaceDefaultProps, ...props };
  const { children, style, containerStyle, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName(rest);

  return (
    <div
      key={computedClassName}
      className={computedClassName}
      ref={ref}
      style={style}
    >
      {children}
    </div>
  );
});

ContainerWorkplaceComponent.displayName = "ContainerWorkplaceComponent";
export default ContainerWorkplaceComponent;
