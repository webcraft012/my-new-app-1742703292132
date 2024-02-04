import { useEditor, useNode } from "@craftjs/core";
import React, { isValidElement } from "react";
import { observer } from "mobx-react";
import Split from "react-split";
import type { ContainerProps } from ".";

export const ContainerHolder: React.FC<ContainerProps> = observer(
  ({ children, className, shouldShowDropHelper }) => {
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

    return (
      <div
        className={`items-center flex flex-row ${className || ""}`}
        ref={(ref) => ref && connect(ref)}
      >
        {!childElements.length && shouldShowDropHelper ? (
          <div className="p-12 w-full flex items-start justify-center shadow">
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
      </div>
    );
  },
);
