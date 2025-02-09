import { BaseComponentProps, ContainerStyles } from "./props";

export interface ContainerProps extends BaseComponentProps {
  containerStyle?: ContainerStyles;
  shouldShowDropHelper?: boolean;
  style?: React.CSSProperties;
  firstChild?: React.ReactNode;
}

export const DRAG_AND_DROP_PADDING = 8;
