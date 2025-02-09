export interface UIElement {
  type: string;
  children: UIElement[];
  props: Record<string, any>;
  textContent?: string;
}

/**
 * List of available UI elements that the AI can use to build the UI
 */
export const availableUIElement = [
  "workspace",
  "container",
  "column",
  "row",
  "button",
  "text",
  "image",
];

/**
 * Map of UI elements to their component names
 */
export const uiElementMapWithComponentName = {
  container: {
    name: "Container",
    isCanvas: false,
    hasLinkedNodes: true,
    directChild: "container_workplace",
    linkedNodeName: "row-container",
  },
  column: { name: "Column", isCanvas: true, hasLinkedNodes: false },
  row: {
    name: "ContainerRowWorkplace",
    isCanvas: true,
    hasLinkedNodes: false,
  },
  button: { name: "Button", isCanvas: false, hasLinkedNodes: false },
  text: { name: "Text", isCanvas: false, hasLinkedNodes: false },
  image: { name: "Image", isCanvas: false, hasLinkedNodes: false },
  workplace: {
    name: "WorkplaceHolder",
    isCanvas: true,
    hasLinkedNodes: false,
    isMain: true,
  },
  container_workplace: {
    name: "ContainerWorkplace",
    isCanvas: true,
    hasLinkedNodes: false,
  },
};
