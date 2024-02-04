"use client";

import type { ReactNode } from "react";
import React from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div
      className={`container mx-auto p-4 w-full flex flex-col h-fit ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
