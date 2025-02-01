"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { ContainerStyleSelector } from "../../settings-components/container-style-selector";
import { ContainerStyles } from "../../settings-components/types";
import { ColorSelector } from "../../settings-components/color-selector";
import { ContainerProps } from "@webcraft/types";

export const ContainerSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { backgroundColor, containerStyle },
  } = useNode<{ props: ContainerProps }>((node) => ({
    props: node.data.props as ContainerProps,
  }));

  const onContainerStyleChange = (value: ContainerStyles): void => {
    setProp((currentProps: ContainerProps) => {
      currentProps.containerStyle = value;
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: ContainerProps) => {
      currentProps.backgroundColor = value;
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
          defaultValue={backgroundColor}
          label="Background Color"
          onChange={onBackgroundColorChange}
        />
      </div>
    </div>
  );
};
