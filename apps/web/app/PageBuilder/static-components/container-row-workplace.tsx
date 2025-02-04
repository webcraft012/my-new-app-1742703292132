"use client";

import { PropsWithChildren } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { ContainerProps } from "@webcraft/types";

const defaultClassName = "items-center flex flex-row relative max-w-full";

const ContainerRowWorkplaceComponent = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ContainerProps>
>((props, ref) => {
  const {
    children,
    className,
    style,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    backgroundColor,
    containerStyle,
    ...rest
  } = props;

  const computedClassName = useBuildClassName({
    customClassName: `${defaultClassName} ${className}`,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    containerStyle,
    backgroundColor,
    ...rest,
  });

  return (
    <div className={computedClassName} ref={ref} style={style} {...rest}>
      {children}
    </div>
  );
});

ContainerRowWorkplaceComponent.displayName = "ContainerRowWorkplaceComponent";
export default ContainerRowWorkplaceComponent;
