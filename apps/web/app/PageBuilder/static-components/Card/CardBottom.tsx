"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";
import { CardBottomProps } from "@webcraft/types";

const defaultClassName = "w-full h-auto min-h-[20px] flex gap-2";

const CardBottomComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardBottomProps>
>((props, ref) => {
  const { children, className } = props;

  const computedClassName = useBuildClassName({
    customClassName: `${defaultClassName} ${className}`,
  });

  return (
    <div className={computedClassName} ref={ref}>
      {children}
    </div>
  );
});

CardBottomComponent.displayName = "CardBottom";

export default CardBottomComponent;
