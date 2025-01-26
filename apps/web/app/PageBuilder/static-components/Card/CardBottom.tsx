"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";
import { useBuildClassName } from "../../hooks/useBuildClassName";

export interface CardBottomProps {
  className?: string;
  children?: ReactNode;
}

const defaultClassName = "w-full h-auto min-h-[20px] flex gap-2";

const CardBottomComponent = forwardRef<HTMLDivElement, CardBottomProps>(
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

CardBottomComponent.displayName = "CardBottom";

export default CardBottomComponent;
