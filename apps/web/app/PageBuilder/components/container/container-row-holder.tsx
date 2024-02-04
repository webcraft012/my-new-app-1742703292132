import { useNode } from "@craftjs/core";
import type { ContainerProps } from ".";

export const ContainerRowHolder: React.FC<ContainerProps> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      className="flex flex-col gap-4 flex-wrap"
      ref={(ref) => ref && connect(ref)}
    >
      {children}
    </div>
  );
};
