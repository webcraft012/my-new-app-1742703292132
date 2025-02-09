import { forwardRef } from "react";

import { useBuildClassName } from "../hooks/useBuildClassName";

export interface ImageComponentProps {
  imageSrc?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const defaultClassName = "";

const ImageComponent = forwardRef<HTMLImageElement, ImageComponentProps>(
  (props, ref) => {
    const { imageSrc, alt, width, height, className } = props;
    const computedClassName = useBuildClassName({
      customClassName: `${defaultClassName} ${className}`,
    });
    return (
      <div>
        <img
          width={width}
          height={height}
          src={imageSrc}
          alt={alt}
          ref={ref}
        ></img>
      </div>
    );
  },
);

ImageComponent.displayName = "Image";
export default ImageComponent;
