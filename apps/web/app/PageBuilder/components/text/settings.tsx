"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { AlignmentSelector } from "../../settings-components/align-selector";
import { ColorSelector } from "../../settings-components/color-selector";
import { FormatSelector } from "../../settings-components/format-selector";
import type { TextTypes } from "../../settings-components/types";
import { AlignmentTypes, FormatTypes } from "../../settings-components/types";
import { TextTypeSelector } from "../../settings-components/text-type-selector";
import type { TextProps } from ".";

export const TextSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { textAlign, textFormats, color, backgroundColor, textType },
  } = useNode<{ props: TextProps }>((node) => ({
    props: node.data.props as TextProps,
  }));

  const onFormatChange = (values: FormatTypes[]): void => {
    setProp((currentProps: TextProps) => {
      currentProps.textFormats = values;
    });
  };

  const onAlignmentChange = (value: AlignmentTypes): void => {
    setProp((currentProps: TextProps) => {
      currentProps.textAlign = value;
    });
  };

  const onColorChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.color = value;
    });
  };

  const onTypeChange = (value: TextTypes): void => {
    setProp((currentProps: TextProps) => {
      currentProps.textType = value;
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
        <TextTypeSelector defaultValue={textType} onChange={onTypeChange} />
      </div>
      <div>
        <FormatSelector defaultValues={textFormats} onChange={onFormatChange} />
      </div>
      <div>
        <AlignmentSelector
          defaultValue={textAlign}
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
