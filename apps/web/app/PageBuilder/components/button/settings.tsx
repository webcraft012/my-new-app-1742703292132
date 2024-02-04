"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { AlignmentSelector } from "../../settings-components/align-selector";
import { ColorSelector } from "../../settings-components/color-selector";
import { AlignmentTypes, WidthTypes } from "../../settings-components/types";
import { WidthSelector } from "../../settings-components/width-selector";
import { createReverseMapping } from "../../utils/reverse-mappings";
import type { ButtonProps } from ".";

const widthOptions: Record<WidthTypes, string> = {
  [WidthTypes.Auto]: "w-auto",
  [WidthTypes.Full]: "flex justify-center w-full items-center",
};

const alignmentOptions: Record<AlignmentTypes, string> = {
  [AlignmentTypes.Left]: "justify-start",
  [AlignmentTypes.Center]: "justify-center",
  [AlignmentTypes.Right]: "justify-end",
  [AlignmentTypes.Justify]: "text-justify",
};

const reversedWidthOptions = createReverseMapping(widthOptions);

export const ButtonSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { align, backgroundColor, width, textColor },
  } = useNode<{ props: ButtonProps }>((node) => ({
    props: node.data.props as ButtonProps,
  }));

  const onWidthChange = (value: WidthTypes): void => {
    console.log({ value });
    setProp((currentProps: ButtonProps) => {
      currentProps.width = widthOptions[value];
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

  const onAlignmentChange = (value: AlignmentTypes): void => {
    setProp((currentProps: ButtonProps) => {
      currentProps.align = alignmentOptions[value];
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <AlignmentSelector
          defaultValue={
            Object.keys(alignmentOptions).find(
              (_k) =>
                alignmentOptions[_k as keyof typeof alignmentOptions] === align,
            ) as AlignmentTypes
          }
          onChange={onAlignmentChange}
        />
      </div>
      <div>
        <WidthSelector
          defaultValue={
            width ? (reversedWidthOptions[width] as WidthTypes) : undefined
          }
          onChange={onWidthChange}
        />
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
