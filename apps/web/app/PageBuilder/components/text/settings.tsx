"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { TextAlignmentSelector } from "../../settings-components/text-align-selector";
import { ColorSelector } from "../../settings-components/color-selector";
import { TextSizeSelector } from "../../settings-components/text-size-selector";
import type { TextProps } from ".";

export const TextSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { textAlign, textColor, bg, fontSize },
  } = useNode<{ props: TextProps }>((node) => ({
    props: node.data.props as TextProps,
  }));

  // const onFormatChange = (values: FormatTypes[]): void => {
  //   setProp((currentProps: TextProps) => {
  //     currentProps.textFormats = values;
  //   });
  // };

  const onAlignmentChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.textAlign = value;
    });
  };

  const onColorChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.textColor = value;
    });
  };

  const onTextSizeChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.fontSize = value;
    });
  };

  const onBackgroundColorChange = (value: string): void => {
    setProp((currentProps: TextProps) => {
      currentProps.bg = value;
    });
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <TextSizeSelector defaultValue={fontSize} onChange={onTextSizeChange} />
      </div>
      {/* <div>
        <FormatSelector defaultValues={textFormats} onChange={onFormatChange} />
      </div> */}
      <div>
        <TextAlignmentSelector
          defaultValue={textAlign}
          onChange={onAlignmentChange}
        />
      </div>
      <div>
        <ColorSelector
          defaultValue={textColor}
          onChange={onColorChange}
          type="text"
        />
      </div>
      <div>
        <ColorSelector
          defaultValue={bg}
          label="Background color"
          onChange={onBackgroundColorChange}
          type="bg"
        />
      </div>
    </div>
  );
};
