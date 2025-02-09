import type { FC } from "react";
import React from "react";
import { useNode, UserComponent, Element } from "@craftjs/core";
import ColumnComponent from "../../static-components/column-container";
import { BaseComponentProps } from "@webcraft/types";
import { Column } from "./column";

export const ColumnHolder: React.FC<
  React.PropsWithChildren<BaseComponentProps>
> = (props) => {
  return (
    <div>
      <Element id="column-holder" is={Column} {...props}>
        {props.children}
      </Element>
    </div>
  );
};
