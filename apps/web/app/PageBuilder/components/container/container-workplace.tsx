import { useNode, UserComponent } from "@craftjs/core";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { DropIndicator } from "../../helpers/DropIndicator";
import { ContainerSettings } from "./settings";
import ContainerWorkplaceComponent from "../../static-components/container-workplace";
import { ContainerProps, ContainerStyles } from "@webcraft/types";
import { PropsWithChildren } from "react";
import { getContainerPadding } from "../../utils/padding";

export const ContainerWorkplace: UserComponent<
  PropsWithChildren<ContainerProps>
> = observer(({ children, containerStyle, bg, pt, pb, pl, pr, ...props }) => {
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

  console.log({
    shouldAddPadding,
    containerStyle,
  });
  return (
    <ContainerWorkplaceComponent
      ref={(ref) => ref && connect(ref)}
      containerStyle={containerStyle}
      bg={bg}
      pt={`pt-${getContainerPadding(shouldAddPadding, pt)}`}
      pb={`pb-${getContainerPadding(shouldAddPadding, pb)}`}
      pl={pl}
      pr={pr}
      data-id="container-workplace"
      style={{
        border: userComponentStore.onDragUserComponent
          ? "1px dashed #ccc"
          : "unset",
      }}
      {...props}
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
  related: {
    settings: ContainerSettings,
  },
};
