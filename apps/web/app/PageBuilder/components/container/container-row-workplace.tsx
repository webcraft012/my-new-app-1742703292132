import { useEditor, useNode } from "@craftjs/core";
import React, { isValidElement, PropsWithChildren } from "react";
import { observer } from "mobx-react";
import Split from "react-split";
import { userComponentStore } from "../../store";
import { DropIndicator } from "../../helpers/DropIndicator";
import { ContainerProps } from "@webcraft/types";
import ContainerRowWorkplaceComponent from "../../static-components/container-row-workplace";
import { getContainerPadding } from "../../utils/padding";

export const ContainerRowWorkplace: React.FC<
  PropsWithChildren<ContainerProps>
> = observer(
  ({
    children,
    className,
    shouldShowDropHelper,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }) => {
    const {
      connectors: { connect },
    } = useNode();

    const { store, actions } = useEditor();

    // Assuming children is a single React element
    const childElements: React.ReactElement[] = isValidElement(children)
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        children.props.children
      : [];

    // Generate a key based on the child elements
    const splitKey = childElements
      .map((child: React.ReactElement) => child.key)
      .join("-");

    if (!children && !shouldShowDropHelper) return null;

    const computeInitialSizes = (): number[] | undefined => {
      const initialSizes = childElements.map((child) => {
        if (!child.key) return 0;

        const node = store.query.node(child.key).get();
        const width = node.data.props.width;

        if (!width) return undefined;

        return parseInt(width, 10);
      });

      if (initialSizes.includes(undefined) || initialSizes.includes(100))
        return undefined;

      return initialSizes as number[];
    };

    const shouldAddPadding = userComponentStore.onDragUserComponent;

    return (
      <ContainerRowWorkplaceComponent
        ref={(ref) => ref && connect(ref)}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        paddingLeft={getContainerPadding(shouldAddPadding, paddingLeft)}
        paddingRight={getContainerPadding(shouldAddPadding, paddingRight)}
        data-id="container-row-workplace"
      >
        {userComponentStore.onDragUserComponent && (
          // update opacity on drag over
          <DropIndicator className="top-0 left-3 w-6" />
        )}
        {!childElements.length && shouldShowDropHelper ? (
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
          <Split
            className="flex w-full"
            direction="horizontal"
            gutterSize={4}
            key={
              splitKey +
              computeInitialSizes()
                ?.map((size) => size.toString())
                .join("-")
            }
            onDragEnd={(sizes) => {
              childElements.forEach((child, index) => {
                if (!child.key) return;

                actions.setProp(child.key, (props: { width?: string }) => {
                  props.width = `${sizes[index]}`;
                });
              });
              console.log({
                node: store.query.getNodes(),
                childElements,
                sizes,
              });
            }}
            sizes={computeInitialSizes()}
          >
            {children || <div className="p-12 w-full">Drop elements here</div>}
          </Split>
        )}
        {userComponentStore.onDragUserComponent && (
          // update opacity on drag over
          <DropIndicator className="top-0 right-3 w-6" />
        )}
      </ContainerRowWorkplaceComponent>
    );
  },
);
