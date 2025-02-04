import { ContainerStyles } from "./props";

export interface ContainerProps {
  className?: string;
  containerStyle?: ContainerStyles;
  backgroundColor?: string;
  shouldShowDropHelper?: boolean;
  style?: React.CSSProperties;
  firstChild?: React.ReactNode;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  padding?: number;
}

export const DRAG_AND_DROP_PADDING = 8;
