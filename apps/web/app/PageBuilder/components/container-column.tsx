import React from "react";

export const ContainerColumn: React.FC<ContainerColumnProps> = ({
  children,
  index,
}) => {
  // useHorizontalResize({
  //   holdToResizeDivId: `resize-handle-${index}`,
  //   leftSideId: `resizable-column-${index}`,
  //   rightSideId: `resizable-column-${index + 1}`,
  // });

  return (
    <>
      <div
        className="resizable split-pane h-full"
        id={`resizable-column-${index}`}
      >
        {children}
      </div>
      {/* {shouldShowResizeHandle ? (
        <div className="h-full relative flex items-center justify-center">
          <div
            className="absolute hover:cursor-col-resize w-2 h-full bg-slate-500"
            id={`resize-handle-${index}`}
          >
            <div className="w-2" />
          </div>
        </div>
      ) : null} */}
    </>
  );
};

interface ContainerColumnProps {
  index: number;
  children?: React.ReactNode;
}
