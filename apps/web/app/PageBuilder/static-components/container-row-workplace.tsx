"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { ContainerProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";
// const defaultClassName = "items-center flex flex-row relative max-w-full";

export const ContainerRowWorkplaceDefaultProps: Partial<ContainerProps> = {
  display: "flex",
  flexDirection: "flex-row",
  w: "w-full",
  gap: "gap-4",
  position: "relative",
  // flexWrap: "flex-wrap",
};

const ContainerRowWorkplaceComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContainerProps>
>((props, ref) => {
  const mergedProps = { ...ContainerRowWorkplaceDefaultProps, ...props };
  const { children, style, ...rest } = mergedProps;

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

ContainerRowWorkplaceComponent.displayName = "ContainerRowWorkplaceComponent";
export default ContainerRowWorkplaceComponent;
