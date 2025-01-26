import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React from "react";
import CardTopComponent, {
  CardTopProps,
} from "../../static-components/Card/CardTop";

export const CardTop: UserComponent<CardTopProps> = ({
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
