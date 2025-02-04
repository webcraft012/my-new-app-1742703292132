import type { SerializedNode, SerializedNodes } from "@craftjs/core";
import React from "react";
import Container from "./container";
import Holder from "./holder";
import ContainerRowWorkplace from "./container-row-workplace";
import axios from "axios";
import { API_URL } from "../PageBuilder/hooks/types";
import { EditorDto } from "@webcraft/types";
import TextComponent from "../PageBuilder/static-components/text";
import ButtonComponent from "../PageBuilder/static-components/button";
import CardComponent from "../PageBuilder/static-components/Card";
import FlexContainerComponent from "../PageBuilder/static-components/FlexContainer";
import ContainerWorkplaceComponent from "../PageBuilder/static-components/container-workplace";

const HomePage = async (): Promise<React.JSX.Element | null> => {
  const nodes = await getData();

  const renderComponents = (): React.JSX.Element | null => {
    if (nodes) return <>{nodes}</>;
    return null;
  };

  return renderComponents();
};

async function getData(): Promise<React.JSX.Element | null> {
  try {
    const { data } = await axios.get<EditorDto>(
      `${API_URL}/editors/af9a001974655fc48685d003525a3584`,
    );

    const state = data?.state ?? "";
    const nodes: SerializedNodes = JSON.parse(state);

    return createComponentsFromJson(nodes);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}

const componentMap = {
  Workspace: Container,
  WorkplaceHolder: Holder,
  ContainerWorkplace: ContainerWorkplaceComponent,
  Card: CardComponent,
  CardBottom: Holder,
  CardTop: Holder,
  Button: ButtonComponent,
  Text: TextComponent,
  Container: FlexContainerComponent,
  ContainerRowWorkplace,
  Spacer: Container,
  FlexContainer: FlexContainerComponent,
};

function createComponentFromNode(
  node: SerializedNode,
  nodes: SerializedNodes,
): React.JSX.Element | null {
  const Component = componentMap[node.displayName];
  if (!Component) return null;

  const childNodes: React.ReactNode[] = [];

  // Process linkedNodes first
  if (node.linkedNodes) {
    Object.values(node.linkedNodes).forEach((linkedNodeId) => {
      const childNode = nodes[linkedNodeId];
      if (childNode) {
        childNodes.push(createComponentFromNode(childNode, nodes));
      }
    });
  }

  // Then process nodes array
  if (node.nodes) {
    node.nodes.forEach((nodeId) => {
      const childNode = nodes[nodeId];
      if (childNode) {
        childNodes.push(createComponentFromNode(childNode, nodes));
      }
    });
  }

  return <Component {...node.props}>{childNodes}</Component>;
}

function createComponentsFromJson(
  json: SerializedNodes,
): React.JSX.Element | null {
  if (!json?.ROOT) return null;

  return createComponentFromNode(json.ROOT, json) as React.JSX.Element;
}

export default HomePage;
