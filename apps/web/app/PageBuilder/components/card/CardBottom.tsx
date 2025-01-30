import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React, { PropsWithChildren } from "react";
import CardBottomComponent from "../../static-components/Card/CardBottom";
import { CardBottomProps } from "@webcraft/types";

export const CardBottom: UserComponent<PropsWithChildren<CardBottomProps>> = ({
  children,
  className,
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <CardBottomComponent
      className={className}
      ref={(ref) => ref && connect(ref)}
    >
      {children}
    </CardBottomComponent>
  );
};
