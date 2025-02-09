import { useNode, Element, UserComponent, useEditor } from "@craftjs/core";
import React, { isValidElement, PropsWithChildren, useEffect } from "react";
import { observer } from "mobx-react";
import { userComponentStore } from "../../store";
import { DropIndicator } from "../../helpers/DropIndicator";
import { ContainerProps } from "@webcraft/types";
import ContainerRowWorkplaceComponent, {
  ContainerRowWorkplaceDefaultProps,
} from "../../static-components/container-row-workplace";
import { getContainerPadding } from "../../utils/padding";
import { Column } from "./column";
import { cp } from "fs";
import { ColumnHolder } from "./column-holder";

export const ContainerRowWorkplace: UserComponent<
  PropsWithChildren<ContainerProps>
> = observer(({ children, shouldShowDropHelper, pt, pb, pl, pr, ...props }) => {
  const { query } = useEditor();

  const {
    connectors: { connect },
  } = useNode();

  // Assuming children is a single React element
  const childElements: React.ReactElement[] = isValidElement(children)
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      children.props.children
    : [];

  const hasNoChildren =
    (childElements.length === 1 &&
      query.node(childElements[0].props.id).get()?.data.nodes.length === 0) ||
    !childElements.length;

  if (!children && !shouldShowDropHelper) return null;

  console.log(userComponentStore.onDragUserComponent);

  const shouldAddPadding = userComponentStore.onDragUserComponent;

  return (
    <ContainerRowWorkplaceComponent
      ref={(ref) => ref && connect(ref)}
      pt={pt}
      pb={pb}
      pl={`pl-${getContainerPadding(shouldAddPadding, pl)}`}
      pr={`pr-${getContainerPadding(shouldAddPadding, pr)}`}
      data-id="container-row-workplace"
      {...props}
    >
      {userComponentStore.onDragUserComponent && (
        // update opacity on drag over
        <DropIndicator className="top-0 left-3 w-6" />
      )}
      {hasNoChildren && shouldShowDropHelper ? (
        <div
          className="p-12 w-full flex items-start justify-center shadow"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 255, 0.1)";
          }}
          onDragLeave={(e) => {
            e.currentTarget.style.backgroundColor = "unset";
          }}
        >
          Drop elements here
        </div>
      ) : (
        children || <div>No children</div>
      )}
      {userComponentStore.onDragUserComponent && (
        // update opacity on drag over
        <DropIndicator className="top-0 right-3 w-6" />
      )}
    </ContainerRowWorkplaceComponent>
  );
});

ContainerRowWorkplace.craft = {
  props: { ...ContainerRowWorkplaceDefaultProps },
};
