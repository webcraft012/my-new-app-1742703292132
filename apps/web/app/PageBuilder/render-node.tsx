/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import React, { useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import { useNode, useEditor } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
// import ArrowUp from "../../public/icons/arrow-up.svg";
// import Delete from "../../public/icons/delete.svg"; // Uncomment if delete functionality is used

export const RenderNode = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, q) => ({
    isActive: q.getEvent("selected").contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    // deletable, // Uncomment if delete functionality is used
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered && !node.data.displayName.includes("Holder"),
    dom: node.dom,
    name: node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    // deletable: query.node(node.id).isDeletable(), // Uncomment if delete functionality is used
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dom) {
      if ((isActive && !name.includes("Holder")) || isHover)
        dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((adom: HTMLElement) => {
    const { top, left, bottom } = adom
      ? adom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const currentDOM = currentRef.current;

    if (!currentDOM || !dom) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const renderer = document.querySelector(".craftjs-renderer");
    renderer?.addEventListener("scroll", scroll);

    return () => {
      renderer?.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  const container = document.querySelector(".page-container");

  return (
    <>
      {isActive && !name.includes("Holder") && dom && container
        ? ReactDOM.createPortal(
            <div
              className="h-7 mt-[-29px] text-xs leading-3 px-2 py-2 text-white bg-primary fixed flex items-center"
              ref={currentRef}
              style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              <h2 className="flex-1 mr-4">{name}</h2>
              {moveable ? (
                <button
                  className="mr-2 cursor-move"
                  ref={(ref) => ref && drag(ref)}
                  type="button"
                >
                  +
                </button>
              ) : null}
              {id !== ROOT_NODE && (
                <button
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    if (!parent) return;
                    actions.selectNode(parent);
                  }}
                  type="button"
                >
                  UP
                </button>
              )}
              {/* {deletable && (
                <a
                  className="cursor-pointer"
                  onMouseDown={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <Delete />
                </a>
              )} */}
            </div>,
            container,
          )
        : null}
      {render}
    </>
  );
};
