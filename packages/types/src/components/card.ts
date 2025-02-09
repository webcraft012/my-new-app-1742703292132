import { BaseComponentProps } from "./props";

export interface CardBottomProps extends BaseComponentProps {}

export interface CardTopProps extends BaseComponentProps {}

export interface CardComponentProps extends BaseComponentProps {
  imageUrl?: string;
}
