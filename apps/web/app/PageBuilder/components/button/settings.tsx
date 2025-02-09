"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { ColorSelector } from "../../settings-components/color-selector";
import { WidthSelector } from "../../settings-components/width-selector";
import type { ButtonProps } from ".";
import { JustifySelector } from "../../settings-components/justify-selector";

export const ButtonSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { justifyContent, bg, w, textColor },
  } = useNode<{ props: ButtonProps }>((node) => ({
    props: node.data.props as ButtonProps,
  }));

  const onWidthChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.w = value;
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.bg = value;
    });
  };

  const onTextColorChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.textColor = value;
    });
  };

  const onJustifyChange = (value: string): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.justifyContent = value;
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <JustifySelector
          defaultValue={justifyContent}
          onChange={onJustifyChange}
        />
      </div>
      <div>
        <WidthSelector defaultValue={w} onChange={onWidthChange} />
      </div>
      <div>
        <ColorSelector
          defaultValue={bg}
          label="Background Color"
          onChange={onBackgroundColorChange}
          type="bg"
        />
      </div>
      <div>
        <ColorSelector
          defaultValue={textColor}
          label="Text Color"
          onChange={onTextColorChange}
          type="text"
        />
      </div>
    </div>
  );
};
