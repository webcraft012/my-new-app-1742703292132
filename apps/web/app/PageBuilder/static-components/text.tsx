"use client";

import { forwardRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useBuildClassName } from "../hooks/useBuildClassName";
import { AlignmentTypes, FormatTypes, TextTypes } from "../settings-components";
import FlexContainerComponent from "./FlexContainer";

export interface TextComponentProps {
  textAlign?: AlignmentTypes;
  className?: string;
  width?: number;
  text: string;
  color?: string;
  backgroundColor?: string;
  onChange?: (e: ContentEditableEvent) => void;
  textType?: TextTypes;
  textFormats?: FormatTypes[];
  isEditable?: boolean;
}

const defaultClassName = "w-full";

const TextComponent = forwardRef<HTMLElement, TextComponentProps>(
  (props, ref) => {
    const {
      text,
      className,
      color,
      backgroundColor,
      textAlign,
      onChange,
      textFormats,
      textType,
      isEditable,
    } = props;

    const computedClassName = useBuildClassName({
      customClassName: `${defaultClassName} ${className}`,
      textAlign,
      color,
      backgroundColor,
      textFormats,
      textType,
    });

    return (
      <FlexContainerComponent backgroundColor={backgroundColor}>
        <ContentEditable
          className={computedClassName}
          html={text}
          innerRef={ref as any}
          onChange={!isEditable ? () => {} : onChange!}
          style={{
            color,
          }}
          tagName="p"
          disabled={!isEditable}
        />
      </FlexContainerComponent>
    );
  },
);

TextComponent.displayName = "Text";

export default TextComponent;
