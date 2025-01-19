import { Button as ButtonStatic } from "../static";

export const Button = ({ text }: { text: string }) => {
  return <ButtonStatic>{text}</ButtonStatic>
};