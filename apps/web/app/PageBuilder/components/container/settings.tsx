"use client";

import { useEditor, useNode } from "@craftjs/core";
import React from "react";
import { ContainerStyleSelector } from "../../settings-components/container-style-selector";
import { ColorSelector } from "../../settings-components/color-selector";
import { ContainerProps, ContainerStyles } from "@webcraft/types";

export const ContainerSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { bg, containerStyle },
    children,
  } = useNode<{ props: ContainerProps; children: string[] }>((node) => ({
    props: node.data.props as ContainerProps,
    children: Object.values(node.data.linkedNodes),
    data: node.data,
  }));

  const { actions } = useEditor();

  const onContainerStyleChange = (value: ContainerStyles): void => {
    setProp((currentProps: ContainerProps) => {
      currentProps.containerStyle = value;
    });

    // propogate props to children
    children.forEach((child) => {
      console.log({
        child,
      });
      actions.setProp(child, (currentProps: ContainerProps) => {
        currentProps.containerStyle = value;
        return currentProps;
      });
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: ContainerProps) => {
      currentProps.bg = value;
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4 min-w-[180px]">
      <div>
        <ContainerStyleSelector
          defaultValue={containerStyle}
          onChange={onContainerStyleChange}
        />
      </div>
      <div>
        <ColorSelector
          defaultValue={bg}
          label="Background Color"
          onChange={onBackgroundColorChange}
          type="bg"
        />
      </div>
    </div>
  );
};
