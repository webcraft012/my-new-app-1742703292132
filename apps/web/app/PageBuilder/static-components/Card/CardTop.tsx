"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { CardTopProps } from "@webcraft/types";
import { getTailwindClassName } from "../../hooks/useTailwindClassName";

export const CardTopDefaultProps: Partial<CardTopProps> = {
  display: "flex",
  flexDirection: "flex-col",
  gap: "gap-2",
};

const CardTopComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardTopProps>
>((props, ref) => {
  const mergedProps = { ...CardTopDefaultProps, ...props };
  const { children, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName(rest);

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

CardTopComponent.displayName = "CardTop";

export default CardTopComponent;
