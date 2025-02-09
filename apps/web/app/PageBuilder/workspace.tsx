import { Element, useEditor, useNode, UserComponent } from "@craftjs/core";
import React, { PropsWithChildren, useEffect } from "react";
import WorkplaceHolderComponent, {
  defaultWorkplaceHolderProps,
} from "./static-components/workplace-holder-component";
import { BaseComponentProps } from "@webcraft/types";

export const WorkplaceHolder: UserComponent<
  PropsWithChildren<BaseComponentProps>
> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <WorkplaceHolderComponent
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </WorkplaceHolderComponent>
  );
};

WorkplaceHolder.craft = {
  props: { ...defaultWorkplaceHolderProps },
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
