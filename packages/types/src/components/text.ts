import { AlignmentTypes, FormatTypes, TextTypes } from "./props";

export interface TextComponentProps {
  textAlign?: AlignmentTypes;
  className?: string;
  width?: number;
  text: string;
  color?: string;
  backgroundColor?: string;
  textType?: TextTypes;
  textFormats?: FormatTypes[];
  isEditable?: boolean;
}
