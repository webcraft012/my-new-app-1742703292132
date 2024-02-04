import type { Node } from "@craftjs/core";
import { Element, useEditor } from "@craftjs/core";
import React, { isValidElement, useEffect, useState } from "react";
import Split from "react-split-it";
import { ContainerColumn } from "../components/container-column";

// Custom hook to render children of the ContainerHolder component
export const useRenderChildren = (
  children: React.ReactNode,
  holder: React.ReactElement | React.FC,
  index?: number,
  shouldShowDropHelper?: boolean,
): {
  render: boolean;
  content: React.JSX.Element | null;
} => {
  if (isValidElement(children) && "props" in children) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const nestedChildren = children.props.children;

    if (Array.isArray(nestedChildren)) {
      return {
        render: true,
        content: (
          <div className="w-full">
            <Split
              className="split"
              direction="horizontal"
              gutterSize={4}
              horizontal
            >
              {children}
            </Split>
            {/* {(index ?? 0) > 1 && (
              <Element
                canvas
                id={`after-child-${nestedChildren.length}-${index}`}
                index={2}
                is={holder}
                key={`after-child-${nestedChildren.length}-${index}`}
              />
            )} */}
          </div>
        ),
      };
    }
  }

  if (!children && !index && shouldShowDropHelper) {
    return {
      render: true,
      content: (
        <div className="p-12 w-full flex items-start justify-center shadow">
          Drop elements here
        </div>
      ),
    };
  }

  return { render: false, content: null };
};

// Custom hook for managing the state and effects related to node elements
export const useElements = (
  nodeId: string,
  holder: React.ReactElement | React.FC,
): void => {
  const { actions, store } = useEditor();

  const [_elt, setLastAddedElement] = useState<string | undefined | null>();

  useEffect(() => {
    console.log({
      nodes: store.query.getNodes(),
    });
    const lastAddedNodePatches =
      store.history.timeline[store.history.timeline.length - 1].patches;

    const lastAddedNode: Node =
      lastAddedNodePatches[lastAddedNodePatches.length - 1].value;

    setLastAddedElement((elt) => {
      if (!lastAddedNode?.id) return elt;

      const parentNode = store.query.node(lastAddedNode.id).get();

      if (!parentNode) return elt;

      const grandParentNode = lastAddedNode.data.parent
        ? store.query.node(lastAddedNode.data.parent).get()
        : undefined;

      console.log({
        lastAddedNode,
        grandParentNode,
        lastAddedNodePatches,
        parentNode,
        elt,
        shoudQuit:
          (elt && lastAddedNode.id === elt) ||
          (parentNode.data.name !== "Container" &&
            grandParentNode?.data.name !== "ContainerHolder"),
      });

      if (
        (elt && lastAddedNode.id === elt) ||
        (parentNode.data.name !== "Container" &&
          grandParentNode?.data.name !== "ContainerHolder")
      )
        return elt;

      const getContainerId = (nId: string): string | undefined => {
        const _n = store.query.node(nId).get();
        const _parent = _n?.data.parent
          ? store.query.node(_n?.data.parent).get()
          : undefined;

        if (!_parent) return undefined;

        if (_n.data.name === "Container") {
          return _n.id;
        }

        if (_parent?.data.name === "Container") {
          return _parent.id;
        }
        if (_parent?.id === "ROOT") {
          return undefined;
        }

        return getContainerId(_parent.id);
      };

      const newEl = store.query
        .parseReactElement(
          createElement(1, `row-container-1${lastAddedNode.id}`),
        )
        .toNodeTree();

      const n = getContainerId(lastAddedNode.id);

      console.log({ n });

      if (n) {
        actions.addNodeTree(newEl, n, 0);
      }
      return lastAddedNode.id;
    });
  }, [store.history.timeline.length]);

  const createElement = (key: number, id: string): React.JSX.Element => {
    return <Element canvas id={id} index={key} is={holder} key={key} />;
  };
};
