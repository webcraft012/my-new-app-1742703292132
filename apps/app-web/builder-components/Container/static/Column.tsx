import { useNode } from "@craftjs/core";

export const ContainerC = ({ children, customStyle }: ContainerProps) => {

  const {
    connectors: { connect, drag },
    isDragged,
    id,
  } = useNode((node) => ({
    isDragged: node.events.dragged,
  }));


  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className={`flex w-full gap-4 items-center p-4 ${customStyle}`}
    >
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  customStyle?: string;
  background?: string;
  padding?: string;
}

ContainerC.craft = {
  rules: {
    canDrop: () => true, // Ensure elements can be dropped
  },
};
