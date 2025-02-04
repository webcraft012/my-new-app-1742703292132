import { Element, useEditor, useNode } from "@craftjs/core";
import React, { useEffect } from "react";

export const WorkplaceHolder: React.FC<WorkspaceProps> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <main
      className="flex h-full bg-white p-8 w-4/5 flex-col gap-4"
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </main>
  );
};

export const Workspace: React.FC<WorkspaceProps> = ({ children }) => {
  const { query, actions } = useEditor((state) => ({
    hoveredNodeId: state.events.hovered,
  }));

  useEffect(() => {
    // console.log(JSON.parse(query.serialize()));
  }, [query, actions]);

  return (
    <Element canvas id="main" is={WorkplaceHolder}>
      {children}
    </Element>
  );
};

interface WorkspaceProps {
  children?: React.ReactNode;
}
