import { Button as ButtonUI } from "@ui/components/ui/button";

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <ButtonUI {...props}>{children}</ButtonUI>;
};

export type ButtonProps = React.ComponentProps<typeof ButtonUI>;