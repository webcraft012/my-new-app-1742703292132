"use client";

import { forwardRef, PropsWithChildren } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useBuildClassName } from "../hooks/useBuildClassName";
import FlexContainerComponent from "./FlexContainer";
import { TextComponentProps } from "@webcraft/types";

export interface TextComponentWithOnChangeProps extends TextComponentProps {
  onChange?: (e: ContentEditableEvent) => void;
}

const defaultClassName = "w-full";

const TextComponent = forwardRef<
  HTMLElement,
  PropsWithChildren<TextComponentWithOnChangeProps>
>((props, ref) => {
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
});

TextComponent.displayName = "Text";

export default TextComponent;
