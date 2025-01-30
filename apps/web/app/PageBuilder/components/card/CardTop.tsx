import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React, { PropsWithChildren } from "react";
import CardTopComponent from "../../static-components/Card/CardTop";
import { CardTopProps } from "@webcraft/types";

export const CardTop: UserComponent<PropsWithChildren<CardTopProps>> = ({
  children,
  className,
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <CardTopComponent className={className} ref={(ref) => ref && connect(ref)}>
      {children}
    </CardTopComponent>
  );
};
