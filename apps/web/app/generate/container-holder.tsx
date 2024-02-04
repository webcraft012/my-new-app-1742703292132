"use client";

import type { ReactNode } from "react";
import React, { Children } from "react";

interface ContainerHolderProps {
  children?: ReactNode;
  className?: string;
}

const ContainerHolder: React.FC<ContainerHolderProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`items-center flex flex-row flex-wrap gap-4 ${
        className || ""
      }`}
    >
      <div
        className="flex w-full gap-[8px] flex-wrap"
        style={{
          "--num-children": Children.count(children),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ContainerHolder;
