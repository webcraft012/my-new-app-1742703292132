import { useNode } from "@craftjs/core";
import type { ContainerProps } from ".";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { DropIndicator } from "../../helpers/DropIndicator";

export const ContainerRowHolder: React.FC<ContainerProps> = observer(
  ({ children }) => {
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
      <div
        className="flex flex-col gap-4 flex-wrap relative"
        ref={(ref) => ref && connect(ref)}
        data-id="container-row-holder"
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          // paddingLeft: shouldAddPadding ? "2rem" : "unset",
          // paddingRight: shouldAddPadding ? "2rem" : "unset",
        }}
      >
        {/* Update opacity on drag over */}
        {shouldAddPadding && (
          <DropIndicator type="row" className="top-4 left-0" />
        )}
        {children}
        {shouldAddPadding && (
          <DropIndicator type="row" className="bottom-0 left-0" />
        )}
      </div>
    );
  },
);
