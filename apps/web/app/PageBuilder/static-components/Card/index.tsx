"use client";

import { PropsWithChildren, useMemo } from "react";
import { forwardRef } from "react";
import FlexContainerComponent from "../container-component";
import { CardComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../../hooks/useTailwindClassName";

export const CardDefaultProps: Partial<CardComponentProps> = {
  rounded: "rounded",
  shadow: "shadow",
  hover: {
    cursor: "cursor-pointer",
    shadow: "shadow-lg",
  },
  px: "px-6",
  py: "py-4",
  display: "flex",
  flexDirection: "flex-col",
  flexWrap: "flex-wrap",
  flex: "flex-1",
  overflow: "overflow-hidden",
};

const CardComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardComponentProps>
>((props, ref) => {
  const mergedProps = { ...CardDefaultProps, ...props };
  const { children, ...rest } = mergedProps;

  const computedClassName = useMemo(
    () => getTailwindClassName(rest),
    [rest], // List all relevant props
  );

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

CardComponent.displayName = "Card";

export default CardComponent;
