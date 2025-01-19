import { useNode } from "@craftjs/core";

export const ContainerRowHolder: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <div
      className="flex flex-col gap-4 flex-wrap h-full w-full"
      ref={(ref) => ref && connect(ref)}
    >
      {children}
    </div>
  );
};
