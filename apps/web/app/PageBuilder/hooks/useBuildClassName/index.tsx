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
    className.push(customClassName);
  }

  if (width && typeof width === "number") {
    className.push(`w-[${width}%]`);
  } else if (width && widthOptions[width]) {
    className.push(widthOptions[width].class);
  }

  console.log({ className });

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
  customClassName?: string;
};
