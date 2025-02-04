import { cn } from "@ui/lib/utils";
import {
  alignmentClasses,
  AlignmentTypes,
  containerStyleClasses,
  ContainerStyles,
  containerStylesOptions,
  formatClasses,
  FormatTypes,
  itemsAlignClasses,
  ItemsAlignTypes,
  justifyClasses,
  JustifyTypes,
  makeBackgroundColorClass,
  makeColorClass,
  TextTypes,
  textTypesClasses,
  widthOptions,
  WidthTypes,
} from "@webcraft/types";

/**
 * Builds a className string based on the props passed in.
 * @param props - The props to build the className string from.
 * @returns The className string.
 */
export const useBuildClassName = (props: BuildClassNameProps) => {
  const {
    textAlign,
    justify,
    itemsAlign,
    textType,
    textFormats,
    color,
    backgroundColor,
    containerStyle,
    customClassName,
    width,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = props;

  const className: string[] = [];

  if (textAlign && alignmentClasses[textAlign]) {
    className.push(alignmentClasses[textAlign].class);
  }

  if (justify && justifyClasses[justify]) {
    className.push(justifyClasses[justify].class);
  }

  if (itemsAlign && itemsAlignClasses[itemsAlign]) {
    className.push(itemsAlignClasses[itemsAlign].class);
  }

  if (textFormats) {
    textFormats.forEach((format) => {
      className.push(formatClasses[format].class);
    });
  }

  if (containerStyle && containerStyleClasses[containerStyle]) {
    className.push(containerStyleClasses[containerStyle].class);
  }

  if (textType && textTypesClasses[textType]) {
    className.push(textTypesClasses[textType]);
  }

  if (color) {
    className.push(makeColorClass(color));
  }

  if (backgroundColor) {
    className.push(makeBackgroundColorClass(backgroundColor));
  }

  if (customClassName) {
    const filterUndefinedFromCustomClassName = customClassName
      .replace(/\bundefined\b/g, "")
      .trim();
    className.push(filterUndefinedFromCustomClassName);
  }

  if (width && typeof width === "number") {
    className.push(`w-[${width}%]`);
  } else if (width && widthOptions[width]) {
    className.push(widthOptions[width].class);
  }

  if (padding) {
    className.push(`p-${padding}`);
  }

  if (paddingTop) {
    className.push(`pt-${paddingTop}`);
  }

  if (paddingBottom) {
    className.push(`pb-${paddingBottom}`);
  }

  if (paddingLeft) {
    className.push(`pl-${paddingLeft}`);
  }

  if (paddingRight) {
    className.push(`pr-${paddingRight}`);
  }

  return cn(className);
};

export type BuildClassNameProps = {
  textAlign?: AlignmentTypes;
  justify?: JustifyTypes;
  itemsAlign?: ItemsAlignTypes;
  textType?: TextTypes;
  textFormats?: FormatTypes[];
  color?: string;
  width?: WidthTypes | number;
  backgroundColor?: string;
  containerStyle?: ContainerStyles;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  customClassName?: string;
};
