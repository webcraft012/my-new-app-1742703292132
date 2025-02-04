import { ContainerProps } from "./container";
import { JustifyTypes, WidthTypes } from "./props";

export interface FlexContainerProps extends ContainerProps {
  className?: string;
  width?: WidthTypes;
  justify?: JustifyTypes;
  backgroundColor?: string;
}
