"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";

interface TextComponentProps {
  defaultClassName?: string;
  className?: string;
  children?: ReactNode;
  width?: number;
}

const TextComponent = forwardRef<HTMLTextElement, TextComponentProps>(
  (props, ref) => {
    const { children, className, defaultClassName } = props;

    return (
      <div className="flex items-center">
        <button className={`${defaultClassName} ${className}`} ref={ref}>
          {children}
        </button>
      </div>
    );
  },
);

TextComponent.displayName = "Text";

export default TextComponent;
