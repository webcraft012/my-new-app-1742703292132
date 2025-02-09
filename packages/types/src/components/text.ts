import { BaseComponentProps } from "./props";

export interface TextComponentProps extends BaseComponentProps {
  textContent: string;
  isEditable?: boolean;
}
