"use client";

import type { ReactNode } from "react";
import React from "react";

interface ContainerHolderProps {
  children?: ReactNode;
  className?: string;
}

const ContainerRowHolder: React.FC<ContainerHolderProps> = ({ children }) => {
  return <div className="flex flex-col gap-4 flex-wrap">{children}</div>;
};

export default ContainerRowHolder;
