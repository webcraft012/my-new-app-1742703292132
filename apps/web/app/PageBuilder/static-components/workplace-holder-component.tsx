"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { BaseComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export const defaultWorkplaceHolderProps: Partial<BaseComponentProps> = {
  w: "w-full",
  h: "h-full",
  flexDirection: "flex-col",
  display: "flex",
  gap: "gap-4",
  bg: "bg-white",
  p: "p-8",
};

const WorkplaceHolderComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<BaseComponentProps>
>((props, ref) => {
  const mergedProps = { ...defaultWorkplaceHolderProps, ...props };
  const { children, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName(rest);

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

WorkplaceHolderComponent.displayName = "WorkplaceHolder";

export default WorkplaceHolderComponent;
