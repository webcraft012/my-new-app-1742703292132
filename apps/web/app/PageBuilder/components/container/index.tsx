import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import "./styles.css";
import { observer } from "mobx-react";
import { ContainerWorkplace } from "./container-workplace";
import { ContainerRowWorkplace } from "./container-row-workplace";
import { ContainerSettings } from "./settings";
import { ContainerProps } from "@webcraft/types";
import { PropsWithChildren } from "react";

export const Container: UserComponent<PropsWithChildren<ContainerProps>> =
  observer(
    ({
      children,
      firstChild,
      shouldShowDropHelper,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      containerStyle,
      ...rest
    }) => {
      const {
        connectors: { connect },
      } = useNode((_n) => ({
        node: _n,
      }));

      return (
        <div ref={(ref) => ref && connect(ref)} data-id="container">
          <Element
            canvas
            id="row-container"
            is={ContainerWorkplace}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
            containerStyle={containerStyle}
            {...rest}
          >
            <Element
              canvas
              id="col-container"
              is={ContainerRowWorkplace}
              shouldShowDropHelper={shouldShowDropHelper}
              paddingLeft={paddingLeft}
              paddingRight={paddingRight}
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
