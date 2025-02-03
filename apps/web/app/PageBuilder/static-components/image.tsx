import { forwardRef } from "react";
import { JustifyTypes } from "../settings-components";
import { useBuildClassName } from "../hooks/useBuildClassName";
import FlexContainerComponent from "./FlexContainer";

export interface ImageComponentProps {
  imageSrc?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  justify?: JustifyTypes;
}

const defaultClassName = "";

const ImageComponent = forwardRef<HTMLImageElement, ImageComponentProps>(
  (props, ref) => {
    const { imageSrc, alt, width, height, className, justify } = props;
    const computedClassName = useBuildClassName({
      customClassName: `${defaultClassName} ${className}`,
      justify,
    });
    return (
      <FlexContainerComponent justify={justify}>
        <img
          width={width}
          height={height}
          src={imageSrc}
          alt={alt}
          ref={ref}
        ></img>
      </FlexContainerComponent>
    );
  },
);

ImageComponent.displayName = "Image";
export default ImageComponent;
