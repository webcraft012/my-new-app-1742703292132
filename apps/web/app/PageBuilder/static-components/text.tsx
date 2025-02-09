"use client";

import { forwardRef, PropsWithChildren } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { TextComponentProps } from "@webcraft/types";
import { getTailwindClassName } from "../hooks/useTailwindClassName";

export interface TextComponentWithOnChangeProps extends TextComponentProps {
  onChange?: (e: ContentEditableEvent) => void;
}

const TextComponent = forwardRef<
  HTMLElement,
  PropsWithChildren<TextComponentWithOnChangeProps>
>((props, ref) => {
  const { textContent, onChange, isEditable, ...rest } = props;

  const computedClassName = getTailwindClassName(rest);

  return (
    <ContentEditable
      className={computedClassName}
      html={textContent}
      innerRef={ref as any}
      onChange={!isEditable ? () => {} : onChange!}
      tagName="p"
      disabled={!isEditable}
    />
  );
});

TextComponent.displayName = "Text";

export default TextComponent;
