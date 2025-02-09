import { forwardRef } from "react";

import { useBuildClassName } from "../hooks/useBuildClassName";
import { getTailwindClassName } from "../hooks/useTailwindClassName";
import { ImageComponentProps } from "@webcraft/types";

export const ImageComponentDefaultProps: Partial<ImageComponentProps> = {
  w: "w-52",
};

const ImageComponent = forwardRef<HTMLImageElement, ImageComponentProps>(
  (props, ref) => {
    const mergedProps = { ...ImageComponentDefaultProps, ...props };
    const { src, alt, ...rest } = mergedProps;

    const computedClassName = getTailwindClassName(rest);

    return (
      <img src={src} alt={alt} ref={ref} className={computedClassName}></img>
    );
  },
);

ImageComponent.displayName = "Image";
export default ImageComponent;
