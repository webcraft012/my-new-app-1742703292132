import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import "./styles.css";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { ContainerWorkplace } from "./container-workplace";
import { ContainerRowWorkplace } from "./container-row-workplace";
import { ContainerSettings } from "./settings";
import { ContainerProps } from "@webcraft/types";
import { PropsWithChildren } from "react";

export const Container: UserComponent<PropsWithChildren<ContainerProps>> =
  observer(
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
          className={`w-full flex flex-col h-fit ${className || ""} ${
            containerStyle || ""
          }`}
          ref={(ref) => ref && connect(ref)}
          style={{
            backgroundColor,
            border: userComponentStore.onDragUserComponent
              ? "1px dashed #ccc"
              : "unset",
          }}
          data-id="container"
        >
          <Element canvas id="row-container" is={ContainerWorkplace}>
            <Element
              canvas
              id="col-container"
              is={ContainerRowWorkplace}
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
