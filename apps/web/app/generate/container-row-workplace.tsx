"use client";

import type { ReactNode } from "react";
import React, { Children } from "react";

interface ContainerRowWorkplaceProps {
  children?: ReactNode;
  className?: string;
}

const ContainerRowWorkplace: React.FC<ContainerRowWorkplaceProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`items-center flex flex-row flex-wrap gap-4 pr-8 pl-8 ${
        className || ""
      }`}
    >
      <div
        className="flex w-full gap-[8px] flex-wrap justify-between"
        style={{
          "--num-children": Children.count(children),
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ContainerRowWorkplace;
