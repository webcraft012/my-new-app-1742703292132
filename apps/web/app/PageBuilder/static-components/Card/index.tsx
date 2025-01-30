"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";
import FlexContainerComponent from "../FlexContainer";
import { CardComponentProps } from "@webcraft/types";

const defaultClassName =
  "px-6 py-4 flex flex-col flex-1 rounded overflow-hidden shadow-md hover:shadow-lg hover:cursor-pointer";

const CardComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<CardComponentProps>
>((props, ref) => {
  const { children, className, width } = props;

  const computedClassName = useBuildClassName({
    customClassName: `${defaultClassName} ${className}`,
    width,
  });

  return (
    <FlexContainerComponent>
      <div className={computedClassName} ref={ref}>
        {children}
      </div>
    </FlexContainerComponent>
  );
});

CardComponent.displayName = "Card";

export default CardComponent;
