import type { FC } from "react";
import React from "react";
import { useNode, UserComponent } from "@craftjs/core";
import ColumnComponent from "../../static-components/column-container";
import { BaseComponentProps } from "@webcraft/types";

export const Column: UserComponent<
  React.PropsWithChildren<BaseComponentProps>
> = (props) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <ColumnComponent
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      {...props}
    >
      {props.children}
    </ColumnComponent>
  );
};
Column.craft = {
  displayName: "Column",
  rules: {
    canDrop: () => false,
    canMoveIn: () => false,
  },
  // ... other craft configuration if needed
};
