
import { Element, useNode } from "@craftjs/core";
import { Container as ContainerStatic } from "../static";
import { ContainerRowHolder } from "./container-row-holder";
import { ContainerColumn } from "./ContainerColumn";

export const Container = ({ background, padding, children, ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <div ref={(ref) => ref && connect(drag(ref))} className="w-full h-32 bg-blue-500">
      <Element
        canvas
        is={ContainerRowHolder}
        id="container-holder"
        {...props}
      >
        {children}
      </Element>
    </div>
  );
};