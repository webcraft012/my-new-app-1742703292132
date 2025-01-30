import { JustifyTypes, WidthTypes } from "./props";

export interface ButtonComponentProps {
  justify?: JustifyTypes;
  textColor?: string;
  backgroundColor?: string;
  color?: string;
  className?: string;
  width?: WidthTypes;
  text: string;
}
