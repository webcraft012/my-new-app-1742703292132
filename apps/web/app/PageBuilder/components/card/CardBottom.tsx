import type { UserComponent } from "@craftjs/core";
import { useNode } from "@craftjs/core";
import React from "react";
import CardBottomComponent, {
  CardBottomProps,
} from "../../static-components/Card/CardBottom";

export const CardBottom: UserComponent<CardBottomProps> = ({
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
