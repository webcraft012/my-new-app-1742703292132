import { ContainerStyles } from "./props";

export interface ContainerProps {
  className?: string;
  containerStyle?: ContainerStyles;
  backgroundColor?: string;
  shouldShowDropHelper?: boolean;
  style?: React.CSSProperties;
  firstChild?: React.ReactNode;
}
