"use client";

import { Sidebar as SidebarUI } from "@ui/components/ui/sidebar";
import { DraggableButton } from "./draggable-button";
import { useEditor } from "@craftjs/core";
import { Button, Container } from "../../builder-components";

export const SideBar = () => {
  const { connectors } = useEditor();

  const handleDragComponent =
    (
      component: JSX.Element,
    ): React.RefCallback<HTMLButtonElement> =>
      (ref) => {
        if (ref) {
          connectors.create(ref, component);
        }
      };

  return <SidebarUI title="Sidebar">
    <DraggableButton
      label="Button"
      ref={handleDragComponent(<Button text="Click me" />)}
    />
    <DraggableButton
      label="Clcik 2"
      ref={handleDragComponent(<Button text="Click me second" />)}
    />
    <DraggableButton
      label="Container"
      ref={handleDragComponent(<Container />)}
    />
  </SidebarUI>;
};
