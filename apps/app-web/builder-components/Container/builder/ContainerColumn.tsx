import React from "react";

import { Element, useNode } from "@craftjs/core";
import { ContainerC } from "../static/Column";

export const ContainerColumn: React.FC<{ children?: React.ReactNode }> = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
    isHovered
  } = useNode((node) => ({
    isHovered: node.events.hovered,
  }));

  return (
    <div ref={(ref) => ref && connect(drag(ref))} className="bg-red-500 border-2 border-black-500 h-full w-full">
      {children}
    </div>
  );
};