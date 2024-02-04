"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { ContainerStyleSelector } from "../../settings-components/container-style-selector";
import {
  ContainerStyles,
  containerStylesOptions,
} from "../../settings-components/types";
import { ColorSelector } from "../../settings-components/color-selector";
import type { ContainerProps } from ".";

export const ContainerSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { backgroundColor, containerStyle },
  } = useNode<{ props: ContainerProps }>((node) => ({
    props: node.data.props as ContainerProps,
  }));

  const onContainerStyleChange = (value: ContainerStyles): void => {
    setProp((currentProps: ContainerProps) => {
      currentProps.containerStyle = containerStylesOptions.find(
        (style) => style.value === value,
      )?.class;
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
          defaultValue={
            containerStylesOptions.find(
              (style) => style.class === containerStyle,
            )?.value ?? ContainerStyles.Plain
          }
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
