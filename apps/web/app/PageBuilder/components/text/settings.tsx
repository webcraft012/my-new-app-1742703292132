"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { AlignmentSelector } from "../../settings-components/align-selector";
import { ColorSelector } from "../../settings-components/color-selector";
import { FormatSelector } from "../../settings-components/format-selector";
import type { TextTypes } from "../../settings-components/types";
import {
  AlignmentTypes,
  FormatTypes,
  textTypesOptions,
} from "../../settings-components/types";
import { TextTypeSelector } from "../../settings-components/text-type-selector";
import type { TextProps } from ".";

const formatOptions: Record<FormatTypes, string> = {
  [FormatTypes.Bold]: "font-bold",
  [FormatTypes.Italic]: "italic",
  [FormatTypes.Underline]: "underline",
  [FormatTypes.Strikethrough]: "line-through",
  [FormatTypes.Code]: "font-mono",
  [FormatTypes.Subscript]: "sub",
};

const alignmentOptions: Record<AlignmentTypes, string> = {
  [AlignmentTypes.Left]: "text-left",
  [AlignmentTypes.Center]: "text-center",
  [AlignmentTypes.Right]: "text-right",
  [AlignmentTypes.Justify]: "text-justify",
};

export const TextSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { align, format, color, type, backgroundColor },
  } = useNode<{ props: TextProps }>((node) => ({
    props: node.data.props as TextProps,
  }));

  const onFormatChange = (values: FormatTypes[]): void => {
    setProp((currentProps: TextProps) => {
      currentProps.format = values
        .map((value) => formatOptions[value])
        .join(" ");
    });
  };

  const onAlignmentChange = (value: AlignmentTypes): void => {
    setProp((currentProps: TextProps) => {
      currentProps.align = alignmentOptions[value];
    });
  };

  const onColorChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.color = value;
    });
  };

  const onTypeChange = (value: TextTypes): void => {
    setProp((currentProps: TextProps) => {
      currentProps.type = textTypesOptions.find(
        (types) => types.value === value,
      )?.class;
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.backgroundColor = value;
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <TextTypeSelector
          defaultValue={
            textTypesOptions.find((types) => types.class === type)?.value
          }
          onChange={onTypeChange}
        />
      </div>
      <div>
        <FormatSelector
          defaultValues={
            format?.split(" ").map((className) => {
              const key = Object.keys(formatOptions).find(
                (_k) =>
                  formatOptions[_k as keyof typeof formatOptions] === className,
              );
              return key as FormatTypes;
            }) || []
          }
          onChange={onFormatChange}
        />
      </div>
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
        <ColorSelector defaultValue={color} onChange={onColorChange} />
      </div>
      <div>
        <ColorSelector
          defaultValue={backgroundColor}
          label="Background color"
          onChange={onBackgroundColorChange}
        />
      </div>
    </div>
  );
};
