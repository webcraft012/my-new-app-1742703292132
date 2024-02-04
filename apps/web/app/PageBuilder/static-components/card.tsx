"use client";

import type { ReactNode } from "react";
import { forwardRef } from "react";

interface CardProps {
  className?: string;
  children?: ReactNode;
  width?: number;
}

const CardComponent = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { children, className, width } = props;

  return (
    <div
      className="flex flex-1"
      style={{
        "--width": `${width || 100}%`,
        // flexBasis: `${`${width || 100}%`} !important`,
        "--gap-total-width": "calc(8px * (var(--num-children) - 1))",
        flexBasis: "calc(var(--width) - var(--gap-total-width))",
      }}
    >
      <div
        className={`px-6 py-4 rounded overflow-hidden shadow-md hover:shadow-lg hover:cursor-pointer w-full ${
          className || ""
        }`}
        ref={ref}
      >
        {children}
      </div>
    </div>
  );
});

CardComponent.displayName = "Card";

export default CardComponent;
