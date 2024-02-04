import React from "react";
import { useNode } from "@craftjs/core";

export const Spacer: React.FC<SpacerProps> = ({ height, className }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      className={className}
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{ height }}
    />
  );
};

interface SpacerProps {
  className?: string;
  height: number;
}
