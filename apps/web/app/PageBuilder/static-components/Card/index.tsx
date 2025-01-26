"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";
import FlexContainerComponent from "../FlexContainer";
import { WidthTypes } from "../../settings-components";

export interface CardComponentProps {
  className?: string;
  children?: ReactNode;
  width?: WidthTypes;
}

const defaultClassName =
  "px-6 py-4 flex flex-col flex-1 rounded overflow-hidden shadow-md hover:shadow-lg hover:cursor-pointer";

const CardComponent = forwardRef<HTMLDivElement, CardComponentProps>(
  (props, ref) => {
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
  },
);

CardComponent.displayName = "Card";

export default CardComponent;
