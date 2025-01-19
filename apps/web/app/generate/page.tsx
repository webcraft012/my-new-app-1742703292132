import type { SerializedNode, SerializedNodes } from "@craftjs/core";
import React from "react";
import Card from "../PageBuilder/static-components/card";
import Button from "./button";
import Container from "./container";
import Holder from "./holder";
import ContainerHolder from "./container-holder";
import ContainerRowHolder from "./container-row-holder";
import Text from "./text";
import axios from "axios";
import { API_URL, Editor } from "../PageBuilder/hooks/types";

const HomePage = async (): Promise<React.JSX.Element | null> => {
  const nodes = await getData();

  const renderComponents = (): React.JSX.Element | null => {
    if (nodes) return <>{nodes}</>;
    return null;
  };

  return renderComponents();
};

async function getData(): Promise<React.ReactNode> {
  const { data } = await axios.get<Editor>(
    `${API_URL}/editors/af9a001974655fc48685d003525a3584`,
  );
  return new Promise((resolve) => {
    const state = data?.state ?? "";

    const nodes: SerializedNodes = JSON.parse(state);

    resolve(createComponentsFromJson(nodes));
  });
}

const componentMap = {
  Workspace: Container,
  WorkplaceHolder: Holder,
  ContainerRowHolder,
  Card,
  CardBottom: Holder,
  CardTop: Holder,
  Button,
  Text,
  Container,
  ContainerHolder,
  Spacer: Container,
};

function createComponentFromNode(
  node: SerializedNode,
  nodes: SerializedNodes,
): React.ReactNode {
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

function createComponentsFromJson(json: SerializedNodes): React.ReactNode {
  return createComponentFromNode(json.ROOT, json);
}

export default HomePage;
