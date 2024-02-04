import React, { forwardRef } from "react";
import { observer } from "mobx-react";
import { userComponentStore } from "../store";

interface DraggableButtonProps {
  label: string;
}

const DraggableButtonComponent = forwardRef<
  HTMLButtonElement,
  DraggableButtonProps
>((props, ref) => {
  const { label } = props;

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onMouseDown={() => {
        userComponentStore.onDrag();
      }}
      onMouseLeave={() => {
        userComponentStore.onDrop();
      }}
      ref={ref}
    >
      {label}
    </button>
  );
});

DraggableButtonComponent.displayName = "DraggableButton";

export const DraggableButton = observer(DraggableButtonComponent);
