import { useNode, UserComponent } from "@craftjs/core";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { DropIndicator } from "../../helpers/DropIndicator";
import { ContainerSettings } from "./settings";
import ContainerWorkplaceComponent from "../../static-components/container-workplace";
import { ContainerProps, ContainerStyles } from "@webcraft/types";
import { PropsWithChildren } from "react";

export const ContainerWorkplace: UserComponent<
  PropsWithChildren<ContainerProps>
> = observer(({ children, containerStyle, backgroundColor, className }) => {
  const {
    connectors: { connect },
    store,
    id,
  } = useNode();

  // Check in the store, if this node has a child
  const hasChild = store.query
    .node(id)
    .get()
    .data.nodes.some(
      (node) => store.query.node(node).get().data.nodes.length > 0,
    );

  const shouldAddPadding = userComponentStore.onDragUserComponent && hasChild;

  return (
    <ContainerWorkplaceComponent
      ref={(ref) => ref && connect(ref)}
      containerStyle={containerStyle}
      backgroundColor={backgroundColor}
      className={className}
      data-id="container-row-holder"
      style={
        {
          // paddingLeft: shouldAddPadding ? "2rem" : "unset",
          // paddingRight: shouldAddPadding ? "2rem" : "unset",
        }
      }
    >
      {/* Update opacity on drag over */}
      {shouldAddPadding && (
        <DropIndicator type="row" className="top-4 left-0" />
      )}
      {children}
      {shouldAddPadding && (
        <DropIndicator type="row" className="bottom-0 left-0" />
      )}
    </ContainerWorkplaceComponent>
  );
});

ContainerWorkplace.craft = {
  props: {
    containerStyle: ContainerStyles.Plain,
  },
  related: {
    settings: ContainerSettings,
  },
};
