"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import FlexContainerComponent from "./FlexContainer";
import { ContainerProps } from "@webcraft/types";

const defaultClassName = "flex flex-col gap-4 flex-wrap relative pt-8 pb-8";

const ContainerWorkplaceComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContainerProps>
>((props, ref) => {
  const { children, backgroundColor, containerStyle, className, style } = props;

  const computedClassName = useBuildClassName({
    containerStyle,
    backgroundColor,
    customClassName: `${defaultClassName} ${className}`,
  });

  return (
    <div className={computedClassName} ref={ref} style={style}>
      {children}
    </div>
  );
});

ContainerWorkplaceComponent.displayName = "ContainerWorkplace";
export default ContainerWorkplaceComponent;
