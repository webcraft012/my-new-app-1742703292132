"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";

export interface CardTopProps {
  className?: string;
  children?: ReactNode;
}

const defaultClassName = "flex flex-col gap-2";

const CardTopComponent = forwardRef<HTMLDivElement, CardTopProps>(
  (props, ref) => {
    const { children, className } = props;

    const computedClassName = useBuildClassName({
      customClassName: `${defaultClassName} ${className}`,
    });

    return (
      <div className={computedClassName} ref={ref}>
        {children}
      </div>
    );
  },
);

CardTopComponent.displayName = "CardTop";

export default CardTopComponent;
