"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { BaseComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export const defaultColumnProps: Partial<BaseComponentProps> = {
  flex: "flex-1",
  h: "h-full",
  display: "flex",
  // alignSelf: "self-stretch",
};

const ColumnComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseComponentProps>
>((props, ref) => {
  const mergedProps = { ...defaultColumnProps, ...props };
  const { children, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName(rest);

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

ColumnComponent.displayName = "Column";

export default ColumnComponent;
