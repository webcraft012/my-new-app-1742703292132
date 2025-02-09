import { BaseComponentProps } from "./props";

export interface TextComponentProps extends BaseComponentProps {
  text: string;
  isEditable?: boolean;
}
