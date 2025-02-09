import { useNode, UserComponent } from "@craftjs/core";
import ImageComponent, {
  ImageComponentDefaultProps,
} from "../../static-components/image";
import { FC, useEffect } from "react";
import AddPhotoPopover from "../../ui/addPhotoPopover";
import { imageStore } from "../../store/images.store";
import { ImageSettings } from "./settings";
import { ImageComponentProps } from "@webcraft/types";
export interface ImageProps extends ImageComponentProps {}

export const Image: UserComponent<ImageComponentProps> = (props) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    src,
  } = useNode((node) => ({
    src: node.data.props.src,
  }));

  // Sync images with Craft.js state
  useEffect(() => {
    const currentImage = imageStore.images.find(
      (img) => img.previewUrl === src || img.uploadedUrl === src,
    );

    if (currentImage?.uploadedUrl) {
      setProp((props) => (props.src = currentImage.uploadedUrl), 500);
    }
  }, [imageStore.images, src, setProp]);

  const onFileSelect = (file: File | null) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file selected:", file);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setProp((props) => (props.src = previewUrl)); // Update Craft.js state

    imageStore.addImage({
      type: "file",
      value: file,
      previewUrl,
      uploaded: false,
      active: true,
    });
  };

  const onUrlSelect = (url: string) => {
    setProp((props) => (props.src = url)); // Update Craft.js state
    imageStore.addImage({
      type: "url",
      value: url,
      previewUrl: url,
      uploaded: false,
    });
  };

  return (
    <div ref={(ref) => ref && connect(drag(ref))}>
      {src ? (
        <ImageComponent src={src} {...props} />
      ) : (
        <AddPhotoPopover
          onFileSelect={onFileSelect}
          onUrlSelect={onUrlSelect}
          addPhotoButton={1}
          currentsrc={undefined}
        />
      )}
    </div>
  );
};

Image.craft = {
  props: {
    ...ImageComponentDefaultProps,
  },
  related: {
    settings: ImageSettings,
  },
};

export default Image;
