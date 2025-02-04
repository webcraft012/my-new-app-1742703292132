"use client";

import type { ReactNode } from "react";
import React from "react";

interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div>{children}</div>;
};

export default Container;
