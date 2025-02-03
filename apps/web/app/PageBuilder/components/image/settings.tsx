import { useNode } from "@craftjs/core";
import { ImageProps } from ".";
import { JustifyTypes } from "../../settings-components";
import { JustifySelector } from "../../settings-components/justify-selector";

export const ImageSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { justify, height, width, imageSrc, alt },
  } = useNode<{ props: ImageProps }>((node) => ({
    props: node.data.props as ImageProps,
  }));
  const onWidthChange = (value: number): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.width = value;
    });
  };
  const onHeightChange = (value: number): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.height = value;
    });
  };
  const onJustifyChange = (value: JustifyTypes): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.justify = value;
    });
  };
  const onSrcChange = (value: string): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.imageSrc = value;
    });
  };
  const onAltChange = (value: string): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.alt = value;
    });
  };
  return (
    <div className="flex p-4 flex-col gap-4">
      <div>
        <JustifySelector defaultValue={justify} onChange={onJustifyChange} />
      </div>
    </div>
  );
};
