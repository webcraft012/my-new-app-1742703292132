import { Element, useNode } from "@craftjs/core";
import React from "react";

export const WorkplaceHolder: React.FC<WorkplaceProps> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      className="flex h-full bg-white p-4 w-full"
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </div>
  );
};

export const Workplace: React.FC<WorkplaceProps> = ({ children }) => {

  return (
    <Element canvas id="main" is={WorkplaceHolder}>
      {children}
    </Element>
  );
};

interface WorkplaceProps {
  children?: React.ReactNode;
}
