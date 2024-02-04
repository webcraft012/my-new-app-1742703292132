import type { SerializedNode, SerializedNodes } from "@craftjs/core";
import React from "react";
import Card from "../PageBuilder/static-components/card";
import Button from "./button";
import Container from "./container";
import Holder from "./holder";
import ContainerHolder from "./container-holder";
import ContainerRowHolder from "./container-row-holder";
import Text from "./text";

const HomePage = async (): Promise<React.JSX.Element | null> => {
  const nodes = await getData();
  console.log(nodes);

  const renderComponents = (): React.JSX.Element | null => {
    if (nodes) return <>{nodes}</>;
    return null;
  };

  return renderComponents();
};

function getData(): Promise<React.ReactNode> {
  return new Promise((resolve) => {
    const state =
      '"{\\"ROOT\\":{\\"type\\":{\\"resolvedName\\":\\"Workspace\\"},\\"isCanvas\\":false,\\"props\\":{},\\"displayName\\":\\"Workspace\\",\\"custom\\":{},\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"main\\":\\"maG8gZfaet\\"}},\\"maG8gZfaet\\":{\\"type\\":{\\"resolvedName\\":\\"WorkplaceHolder\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"WorkplaceHolder\\",\\"custom\\":{},\\"parent\\":\\"ROOT\\",\\"hidden\\":false,\\"nodes\\":[\\"bHPFOcNY35\\",\\"II_MWKRLQ2\\"],\\"linkedNodes\\":{}},\\"bHPFOcNY35\\":{\\"type\\":{\\"resolvedName\\":\\"Container\\"},\\"isCanvas\\":false,\\"props\\":{\\"firstChild\\":{\\"type\\":{\\"resolvedName\\":\\"Card\\"},\\"isCanvas\\":false,\\"props\\":{\\"text\\":\\"lorem text is a lorem text to be holded\\",\\"title\\":\\"Lorem text\\"}}},\\"displayName\\":\\"Container\\",\\"custom\\":{},\\"parent\\":\\"maG8gZfaet\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"row-container\\":\\"gfWBVOWROj\\"}},\\"gfWBVOWROj\\":{\\"type\\":{\\"resolvedName\\":\\"ContainerRowHolder\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"ContainerRowHolder\\",\\"custom\\":{},\\"parent\\":\\"bHPFOcNY35\\",\\"hidden\\":false,\\"nodes\\":[\\"olUMLT7lL-\\",\\"yxdZq8-pDZ\\"],\\"linkedNodes\\":{}},\\"olUMLT7lL-\\":{\\"type\\":{\\"resolvedName\\":\\"ContainerHolder\\"},\\"isCanvas\\":true,\\"props\\":{\\"id\\":\\"col-container\\"},\\"displayName\\":\\"ContainerHolder\\",\\"custom\\":{},\\"parent\\":\\"gfWBVOWROj\\",\\"hidden\\":false,\\"nodes\\":[\\"xjWkgcmKq1\\",\\"diH7VwswuI\\"],\\"linkedNodes\\":{}},\\"xjWkgcmKq1\\":{\\"type\\":{\\"resolvedName\\":\\"Card\\"},\\"isCanvas\\":false,\\"props\\":{\\"width\\":\\"24.504343335607974\\",\\"text\\":\\"lorem text is a lorem text to be holded\\",\\"title\\":\\"Lorem text\\"},\\"displayName\\":\\"Card\\",\\"custom\\":{},\\"parent\\":\\"olUMLT7lL-\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"content\\":\\"0PPvgJZ2uG\\",\\"buttons\\":\\"mE435ku0WB\\"}},\\"0PPvgJZ2uG\\":{\\"type\\":{\\"resolvedName\\":\\"CardTop\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardTop\\",\\"custom\\":{},\\"parent\\":\\"xjWkgcmKq1\\",\\"hidden\\":false,\\"nodes\\":[\\"PpANLmubo2\\",\\"6zdbg9ZAOH\\"],\\"linkedNodes\\":{}},\\"PpANLmubo2\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"font-bold text-xl mb-2\\",\\"text\\":\\"Lorem text\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"0PPvgJZ2uG\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"6zdbg9ZAOH\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"text-gray-700 text-base\\",\\"text\\":\\"lorem text is a lorem text to be holded\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"0PPvgJZ2uG\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"mE435ku0WB\\":{\\"type\\":{\\"resolvedName\\":\\"CardBottom\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardBottom\\",\\"custom\\":{},\\"parent\\":\\"xjWkgcmKq1\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"diH7VwswuI\\":{\\"type\\":{\\"resolvedName\\":\\"Card\\"},\\"isCanvas\\":false,\\"props\\":{\\"width\\":\\"75.49565666439203\\",\\"text\\":\\"lorem text is a lorem text to be holded\\",\\"title\\":\\"Lorem text\\"},\\"displayName\\":\\"Card\\",\\"custom\\":{},\\"parent\\":\\"olUMLT7lL-\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"content\\":\\"V_p2OSFgCm\\",\\"buttons\\":\\"ktOj1Z64fw\\"}},\\"V_p2OSFgCm\\":{\\"type\\":{\\"resolvedName\\":\\"CardTop\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardTop\\",\\"custom\\":{},\\"parent\\":\\"diH7VwswuI\\",\\"hidden\\":false,\\"nodes\\":[\\"7iUCZ1yP51\\",\\"_0blF4VNc_\\"],\\"linkedNodes\\":{}},\\"7iUCZ1yP51\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"font-bold text-xl mb-2\\",\\"text\\":\\"Lorem text\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"V_p2OSFgCm\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"_0blF4VNc_\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"text-gray-700 text-base\\",\\"text\\":\\"lorem text is a lorem text to be holded\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"V_p2OSFgCm\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"ktOj1Z64fw\\":{\\"type\\":{\\"resolvedName\\":\\"CardBottom\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardBottom\\",\\"custom\\":{},\\"parent\\":\\"diH7VwswuI\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"yxdZq8-pDZ\\":{\\"type\\":{\\"resolvedName\\":\\"ContainerHolder\\"},\\"isCanvas\\":true,\\"props\\":{\\"id\\":\\"col-container-OyOrYG7sCs\\"},\\"displayName\\":\\"ContainerHolder\\",\\"custom\\":{},\\"parent\\":\\"gfWBVOWROj\\",\\"hidden\\":false,\\"nodes\\":[\\"1yhHsmimI6\\"],\\"linkedNodes\\":{}},\\"1yhHsmimI6\\":{\\"type\\":{\\"resolvedName\\":\\"Card\\"},\\"isCanvas\\":false,\\"props\\":{\\"width\\":100,\\"text\\":\\"lorem text is a lorem text to be holded\\",\\"title\\":\\"Lorem text\\"},\\"displayName\\":\\"Card\\",\\"custom\\":{},\\"parent\\":\\"yxdZq8-pDZ\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"content\\":\\"sixFtFoT3f\\",\\"buttons\\":\\"EbVj6xRaNH\\"}},\\"sixFtFoT3f\\":{\\"type\\":{\\"resolvedName\\":\\"CardTop\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardTop\\",\\"custom\\":{},\\"parent\\":\\"1yhHsmimI6\\",\\"hidden\\":false,\\"nodes\\":[\\"0qUT68OInw\\",\\"y1qyZjA6AI\\"],\\"linkedNodes\\":{}},\\"0qUT68OInw\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"font-bold text-xl mb-2\\",\\"text\\":\\"Lorem text\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"sixFtFoT3f\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"y1qyZjA6AI\\":{\\"type\\":{\\"resolvedName\\":\\"Text\\"},\\"isCanvas\\":false,\\"props\\":{\\"className\\":\\"text-gray-700 text-base\\",\\"text\\":\\"lorem text is a lorem text to be holded\\"},\\"displayName\\":\\"Text\\",\\"custom\\":{},\\"parent\\":\\"sixFtFoT3f\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"EbVj6xRaNH\\":{\\"type\\":{\\"resolvedName\\":\\"CardBottom\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"CardBottom\\",\\"custom\\":{},\\"parent\\":\\"1yhHsmimI6\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"II_MWKRLQ2\\":{\\"type\\":{\\"resolvedName\\":\\"Container\\"},\\"isCanvas\\":false,\\"props\\":{\\"firstChild\\":{\\"type\\":{\\"resolvedName\\":\\"Button\\"},\\"isCanvas\\":false,\\"props\\":{\\"text\\":\\"Click me\\"}}},\\"displayName\\":\\"Container\\",\\"custom\\":{},\\"parent\\":\\"maG8gZfaet\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{\\"row-container\\":\\"tE0DT1NnFj\\"}},\\"tE0DT1NnFj\\":{\\"type\\":{\\"resolvedName\\":\\"ContainerRowHolder\\"},\\"isCanvas\\":true,\\"props\\":{},\\"displayName\\":\\"ContainerRowHolder\\",\\"custom\\":{},\\"parent\\":\\"II_MWKRLQ2\\",\\"hidden\\":false,\\"nodes\\":[\\"OQcuTrtvf6\\"],\\"linkedNodes\\":{}},\\"OQcuTrtvf6\\":{\\"type\\":{\\"resolvedName\\":\\"ContainerHolder\\"},\\"isCanvas\\":true,\\"props\\":{\\"id\\":\\"col-container\\"},\\"displayName\\":\\"ContainerHolder\\",\\"custom\\":{},\\"parent\\":\\"tE0DT1NnFj\\",\\"hidden\\":false,\\"nodes\\":[\\"kIEUus-xk5\\",\\"z5h3Ew7iY3\\"],\\"linkedNodes\\":{}},\\"kIEUus-xk5\\":{\\"type\\":{\\"resolvedName\\":\\"Button\\"},\\"isCanvas\\":false,\\"props\\":{\\"defaultClassName\\":\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit-content h-12\\",\\"text\\":\\"Click me\\",\\"width\\":\\"12.039615647074012\\"},\\"displayName\\":\\"Button\\",\\"custom\\":{},\\"parent\\":\\"OQcuTrtvf6\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}},\\"z5h3Ew7iY3\\":{\\"type\\":{\\"resolvedName\\":\\"Button\\"},\\"isCanvas\\":false,\\"props\\":{\\"defaultClassName\\":\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit-content h-12\\",\\"text\\":\\"Click me\\",\\"className\\":\\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-fit-content h-12 flex justify-center w-full w-auto\\",\\"width\\":\\"87.96038435292598\\"},\\"displayName\\":\\"Button\\",\\"custom\\":{},\\"parent\\":\\"OQcuTrtvf6\\",\\"hidden\\":false,\\"nodes\\":[],\\"linkedNodes\\":{}}}"';

    const nodes: SerializedNodes = JSON.parse(JSON.parse(state));

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
