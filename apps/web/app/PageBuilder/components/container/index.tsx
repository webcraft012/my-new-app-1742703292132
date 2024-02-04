import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import "./styles.css";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { ContainerRowHolder } from "./container-row-holder";
import { ContainerHolder } from "./container-holder";
import { ContainerSettings } from "./settings";

export interface ContainerProps {
  className?: string;
  containerStyle?: string;
  backgroundColor?: string;
  firstChild?: React.ReactNode;
  children?: React.ReactNode;
  index?: number;
  shouldShowDropHelper?: boolean;
  isCol?: boolean;
}

export const Container: UserComponent<ContainerProps> = observer(
  ({
    children,
    containerStyle,
    backgroundColor,
    className,
    firstChild,
    shouldShowDropHelper,
  }) => {
    const {
      connectors: { connect },
    } = useNode((_n) => ({
      node: _n,
    }));

    return (
      <div
        className={`container mx-auto p-4 w-full flex flex-col h-fit ${
          className || ""
        } ${containerStyle || ""}`}
        ref={(ref) => ref && connect(ref)}
        style={{
          backgroundColor,
          border: userComponentStore.onDragUserComponent
            ? "1px dashed #ccc"
            : "unset",
          // padding: userComponentStore.onDragUserComponent ? "1.5rem" : "unset",
        }}
      >
        <Element canvas id="row-container" is={ContainerRowHolder}>
          <Element
            canvas
            id="col-container"
            is={ContainerHolder}
            shouldShowDropHelper={shouldShowDropHelper}
          >
            {firstChild}
          </Element>
          {children}
        </Element>
      </div>
    );
  },
);

Container.craft = {
  related: {
    settings: ContainerSettings,
  },
};

// Container.craft = {
//   isCanvas: false,
//   rules: {
//     canMoveIn: () => false,
//     canDrop: () => false,
//     canDrag: () => false,
//   },
// };
