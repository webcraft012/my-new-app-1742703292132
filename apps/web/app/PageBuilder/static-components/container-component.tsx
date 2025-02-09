"use client";

import React, { forwardRef, PropsWithChildren } from "react";
import { BaseComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export const ContainerComponentProps: Partial<BaseComponentProps> = {
  w: "w-full",
};

const ContainerComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseComponentProps>
>((props, ref) => {
  // Merge default props with received props
  console.log("props", props);
  const mergedProps = { ...ContainerComponentProps, ...props };
  const { children, "data-id": dataId, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName({
    ...rest,
  });

  return (
    <div ref={ref} className={computedClassName} data-id={dataId}>
      {children}
    </div>
  );
});

ContainerComponent.displayName = "Container";

export default ContainerComponent;
