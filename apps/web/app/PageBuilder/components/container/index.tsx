import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import "./styles.css";
import { ContainerWorkplace } from "./container-workplace";
import { ContainerRowWorkplace } from "./container-row-workplace";
import { ContainerSettings } from "./settings";
import { ContainerProps } from "@webcraft/types";
import { PropsWithChildren } from "react";
import ContainerComponent from "../../static-components/container-component";
import { Column } from "./column";

export const Container: UserComponent<PropsWithChildren<ContainerProps>> = ({
  children,
  firstChild,
  shouldShowDropHelper,
  pt,
  pb,
  pl,
  pr,
  containerStyle,
  ...rest
}) => {
  const {
    connectors: { connect },
  } = useNode((_n) => ({
    node: _n,
  }));

  return (
    <ContainerComponent ref={(ref) => ref && connect(ref)} data-id="container">
      <Element
        canvas
        id="row-container"
        is={ContainerWorkplace}
        pt={pt}
        pb={pb}
        containerStyle={containerStyle}
        {...rest}
      >
        <Element
          canvas
          id="col-container"
          is={ContainerRowWorkplace}
          shouldShowDropHelper={shouldShowDropHelper}
          pl={pl}
          pr={pr}
        >
          {firstChild && (
            <Element canvas id={`column`} is={Column}>
              {firstChild}
            </Element>
          )}
        </Element>
        {children}
      </Element>
    </ContainerComponent>
  );
};

Container.craft = {
  related: {
    settings: ContainerSettings,
  },
};
