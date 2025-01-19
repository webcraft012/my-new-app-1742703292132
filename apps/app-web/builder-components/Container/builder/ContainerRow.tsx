
import { Element, useNode } from "@craftjs/core";
import { Container as ContainerStatic } from "../static";
import { ContainerColumn } from "./ContainerColumn";

export const ContainerRow = ({ children, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
  }));

  return (
    <Element
      ref={(ref) => connect(drag(ref))}
      is={ContainerStatic}
      id="container-row"
      customStyle="border border-blue-500 h-24"
      {...props}
    >
      {children}
    </Element>
  );
};