"use client";

import type { ReactNode } from "react";
import React from "react";

interface ContainerWorkplaceProps {
  children?: ReactNode;
  className?: string;
}

const ContainerWorkplace: React.FC<ContainerWorkplaceProps> = ({
  children,
}) => {
  return <div className="flex flex-col gap-4 flex-wrap">{children}</div>;
};

export default ContainerWorkplace;
