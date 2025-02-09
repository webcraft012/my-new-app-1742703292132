"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { CardBottomProps } from "@webcraft/types";
import { getTailwindClassName } from "../../hooks/useTailwindClassName";

export const defaultCardBottomProps: Partial<CardBottomProps> = {
  w: "w-full",
  h: "h-auto",
  minH: "min-h-[20px]",
  display: "flex",
  gap: "gap-2",
};

const CardBottomComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardBottomProps>
>((props, ref) => {
  const mergedProps = { ...defaultCardBottomProps, ...props };
  const { children, ...rest } = mergedProps;

  const computedClassName = getTailwindClassName(rest);

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

CardBottomComponent.displayName = "CardBottom";

export default CardBottomComponent;
