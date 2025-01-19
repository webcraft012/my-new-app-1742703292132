import { useEditor, useNode } from "@craftjs/core";
import { ContainerColumn } from "../builder/ContainerColumn";
import { useState } from "react";

export const Container = ({ children, customStyle }: ContainerProps) => {
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const { hoveredNodeIds, indicators } = useEditor((state) => ({
    hoveredNodeIds: state.events.hovered,
    indicators: state.indicator?.placement
  }));



  const {
    connectors: { connect, drag },
    isDragged,
    id,
  } = useNode((node) => ({
    isDragged: node.events.dragged,
  }));

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    setIsDraggedOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggedOver(false);
    // Logic for handling the drop can be added here
  };


  console.log({ hoveredNodeIds, id, indicators });


  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`flex w-full gap-4 items-center p-4 ${customStyle}`}
      onDragOver={handleDragOver}
    // onDragLeave={handleDragLeave}
    // onDrop={handleDrop}
    >
      {/* {isDraggedOver && <ContainerColumn />} */}
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  customStyle?: string;
  background?: string;
  padding?: string;
}

Container.craft = {
  rules: {
    canDrop: () => true, // Ensure elements can be dropped
  },
};
