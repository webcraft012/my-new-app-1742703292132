"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";

interface ButtonComponentProps {
  align?: string;
  backgroundColor?: string;
  defaultClassName?: string;
  className?: string;
  children?: ReactNode;
  width?: number;
  textColor?: string;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  (props, ref) => {
    const {
      align,
      textColor,
      backgroundColor,
      children,
      className,
      defaultClassName,
    } = props;

    return (
      <div className={`flex items-center w-full ${align}`}>
        <button
          className={`${defaultClassName} ${className}`}
          ref={ref}
          style={{
            backgroundColor,
            color: textColor,
          }}
        >
          {children}
        </button>
      </div>
    );
  },
);

ButtonComponent.displayName = "Button";

export default ButtonComponent;
