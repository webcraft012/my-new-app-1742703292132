import { useNode } from "@craftjs/core";
import { ImageProps } from ".";
import { JustifySelector } from "../../settings-components/justify-selector";
import { ImageSourceSelector } from "../../settings-components/imageSource-selector";
import { ImageAltSelector } from "../../settings-components/imageAlt-selector";
import { imageStore } from "../../store/images.store";
import { useEffect } from "react";
export const ImageSettings: React.FC = () => {
  const {
    actions: { setProp },
    props: { justifyContent, src, alt },
  } = useNode<{ props: ImageProps }>((node) => ({
    props: node.data.props as ImageProps,
  }));
  useEffect(() => {
    const currentImage = imageStore.images.find(
      (img) => img.previewUrl === src || img.uploadedUrl === src,
    );

    if (currentImage?.uploadedUrl) {
      setProp((props) => (props.src = currentImage.uploadedUrl), 500);
    }
  }, [imageStore.images, src, setProp]);
  const onJustifyChange = (value: string): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.justifyContent = value;
    });
  };
  const onSrcChange = (value: string): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.src = value;
    });
  };
  const onAltChange = (value: string): void => {
    setProp((currentProps: ImageProps) => {
      currentProps.alt = value;
    });
  };
  return (
    <div className="flex p-4 flex-col gap-12">
      <div>
        <JustifySelector
          defaultValue={justifyContent}
          onChange={onJustifyChange}
        />
      </div>
      <div>
        <ImageAltSelector
          defaultValue={alt}
          onChange={onAltChange}
        ></ImageAltSelector>
      </div>
      <div>
        <ImageSourceSelector
          defaultValue={src}
          onChange={onSrcChange}
        ></ImageSourceSelector>
      </div>
    </div>
  );
};
