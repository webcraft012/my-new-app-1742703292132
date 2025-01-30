"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";
import { CardTopProps } from "@webcraft/types";

const defaultClassName = "flex flex-col gap-2";

const CardTopComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardTopProps>
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

CardTopComponent.displayName = "CardTop";

export default CardTopComponent;
