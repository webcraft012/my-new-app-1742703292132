"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { ColorSelector } from "../../settings-components/color-selector";
import { JustifyTypes, WidthTypes } from "../../settings-components/types";
import { WidthSelector } from "../../settings-components/width-selector";
import type { ButtonProps } from ".";
import { JustifySelector } from "../../settings-components/justify-selector";

export const ButtonSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { justify, backgroundColor, width, textColor },
  } = useNode<{ props: ButtonProps }>((node) => ({
    props: node.data.props as ButtonProps,
  }));

  const onWidthChange = (value: WidthTypes): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.width = value;
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.backgroundColor = value;
    });
  };

  const onTextColorChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.textColor = value;
    });
  };

  const onJustifyChange = (value: JustifyTypes): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.justify = value;
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <JustifySelector defaultValue={justify} onChange={onJustifyChange} />
      </div>
      <div>
        <WidthSelector defaultValue={width} onChange={onWidthChange} />
      </div>
      <div>
        <ColorSelector
          defaultValue={backgroundColor}
          label="Background Color"
          onChange={onBackgroundColorChange}
        />
      </div>
      <div>
        <ColorSelector
          defaultValue={textColor}
          label="Text Color"
          onChange={onTextColorChange}
        />
      </div>
    </div>
  );
};
