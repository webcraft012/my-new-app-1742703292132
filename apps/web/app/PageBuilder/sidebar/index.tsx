import type { NodeTree } from "@craftjs/core";
import { useEditor, Element } from "@craftjs/core";
import { observer } from "mobx-react";
import React from "react";
import { Button } from "../components/button";
import { Card } from "../components/card";
import { Container } from "../components/container";
import { Text } from "../components/text";
import { ContainerHolder } from "../components/container/container-holder";
import { DraggableButton } from "./draggable-button";

const SidebarNO: React.FC = () => {
  const { connectors, query, actions } = useEditor();

  const selected = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    if (currentNodeId) {
      const node = state.nodes[currentNodeId];
      if (node.id) {
        return {
          id: currentNodeId,
          name: node.data.name,
          settings: node.related.settings,
        };
      }
    }
  });

  const handleDragComponent =
    (
      component: JSX.Element,
      additionalLogic?: (node: NodeTree) => void,
    ): React.RefCallback<HTMLButtonElement> =>
    (ref) => {
      if (ref) {
        connectors.create(ref, component, {
          onCreate: (node: NodeTree) => {
            handleNodeCreation(node, component, additionalLogic);
          },
        });
      }
    };

  const handleNodeCreation = (
    node: NodeTree,
    component: JSX.Element,
    additionalLogic?: (node: NodeTree) => void,
  ): void => {
    const parentNodeId = query.node(node.rootNodeId).get().data.parent;
    const parentNode = parentNodeId ? query.node(parentNodeId).get() : null;

    if (parentNode && parentNode.data.parent === "ROOT") {
      actions.delete(node.rootNodeId);
      const newNodeTree = query
        .parseReactElement(<Container firstChild={component} />)
        .toNodeTree();
      actions.addNodeTree(newNodeTree, parentNode.id);
    } else if (parentNode && parentNode.data.name === "ContainerRowHolder") {
      actions.delete(node.rootNodeId);
      const newNodeTree = query
        .parseReactElement(
          <Element
            canvas
            id={`col-container-${node.rootNodeId}`}
            is={ContainerHolder}
          >
            {component}
          </Element>,
        )
        .toNodeTree();
      actions.addNodeTree(newNodeTree, parentNode.id);
    }

    additionalLogic?.(node);
  };

  return (
    <div className="border-l border-l-gray-100 px-2 py-2 w-1/5">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="pb-2">
          <p>Drag to add</p>
        </div>
        <div className="flex flex-col">
          <DraggableButton
            label="Button"
            ref={handleDragComponent(<Button text="Click me" />)}
          />
        </div>
        <div className="flex flex-col">
          <DraggableButton
            label="Text"
            ref={handleDragComponent(
              <Text text="Lorem text is lorem text here for not here lorem air lorem" />,
            )}
          />
        </div>
        <div className="flex flex-col">
          <DraggableButton
            label="Container"
            ref={handleDragComponent(<Container shouldShowDropHelper />)}
          />
        </div>
        <div className="flex flex-col">
          <DraggableButton
            label="Card"
            ref={handleDragComponent(
              <Card
                text="lorem text is a lorem text to be holded"
                title="Lorem text"
              />,
            )}
          />
        </div>
        {selected.settings ? React.createElement(selected.settings) : null}
      </div>
    </div>
  );
};

export const Sidebar = observer(SidebarNO);
