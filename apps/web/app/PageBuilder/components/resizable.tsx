/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEditor, useNode } from "@craftjs/core";
import cx from "classnames";
import { Resizable } from "re-resizable";
import React, { useEffect, useRef, useState } from "react";

interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

interface ResizerProps extends ContainerProps {
  propKey: {
    width: string;
    height: string;
  };
}

export const Resizer: React.FC<ResizerProps> = ({
  propKey,
  children,
  ...props
}) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect },
  } = useNode((node) => ({
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height],
  }));

  const { isRootNode } = useEditor((state, query) => ({
    isRootNode: query.node(id).isRoot(),
  }));

  const resizable = useRef<Resizable>(null);

  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (resizable.current) {
      setInitialSize({
        width: resizable.current.size.width,
        height: resizable.current.size.height,
      });
    }
  }, [resizable]);

  const handleResizeStop = (_, _direction, _refToElement, delta) => {
    setProp((prop: Dimensions) => {
      prop[propKey.width] = initialSize.width + delta.width;
      prop[propKey.height] = initialSize.height + delta.width;
    });
  };

  return (
    <Resizable
      className={cx([
        {
          "m-auto": isRootNode,
          flex: true,
        },
      ])}
      enable={Object.fromEntries(
        [
          "top",
          "left",
          "bottom",
          "right",
          "topLeft",
          "topRight",
          "bottomLeft",
          "bottomRight",
        ].map((key) => [key, true]),
      )}
      onResize={(_, __, ___, d) => {
        console.log({ d });
        // setProp((prop: Dimensions) => {
        //   prop[propKey.width] = width;
        //   prop[propKey.height] = height;
        // }, 500);
      }}
      // onResizeStart={(e) => {
      //   updateInternalDimensionsInPx();
      //   e.preventDefault();
      //   e.stopPropagation();
      //   const dom = resizable.current?.resizable;
      //   if (!dom) return;
      //   editingDimensions.current = {
      //     width: dom.getBoundingClientRect().width,
      //     height: dom.getBoundingClientRect().height,
      //   };
      //   isResizing.current = true;
      // }}
      onResizeStop={handleResizeStop}
      ref={(ref) => {
        if (ref) {
          if (!resizable.current) return;
          if (resizable.current.resizable) connect(resizable.current.resizable);
        }
      }}
      style={{
        height: "unset",
        width: "unset",
      }}
      {...props}
    >
      {children}
    </Resizable>
  );
};

interface Dimensions {
  width: number;
  height: number;
}
