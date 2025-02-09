import { useNode, UserComponent } from "@craftjs/core";
import ImageComponent, {
  ImageComponentProps,
} from "../../static-components/image";
import { FC, useEffect } from "react";
import AddPhotoPopover from "../../ui/addPhotoPopover";
import { imageStore } from "../../store/images.store";
import { ImageSettings } from "./settings";
export interface ImageProps extends ImageComponentProps {}

interface CraftImage extends FC<ImageProps> {
  craft: {
    props: ImageProps;
    related: {
      settings: React.ComponentType<React.FC>;
    };
  };
}

export const Image: CraftImage = ({ alt, width, height, className }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    imageSrc,
  } = useNode((node) => ({
    imageSrc: node.data.props.imageSrc,
  }));

  // Sync pendingImages with Craft.js state
  useEffect(() => {
    const currentImage = imageStore.images.find(
      (img) => img.previewUrl === imageSrc || img.uploadedUrl === imageSrc,
    );

    if (currentImage?.uploadedUrl) {
      setProp((props) => (props.imageSrc = currentImage.uploadedUrl), 500);
    }
  }, [imageStore.images, imageSrc, setProp]);
  const onFileSelect = (file: File | null) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file selected:", file);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setProp((props) => (props.imageSrc = previewUrl)); // Update Craft.js state

    imageStore.addImage({
      type: "file",
      value: file,
      previewUrl,
      uploaded: false,
      active: true,
    });
  };

  const onUrlSelect = (url: string) => {
    setProp((props) => (props.imageSrc = url)); // Update Craft.js state
    imageStore.addImage({
      type: "url",
      value: url,
      previewUrl: url,
      uploaded: false,
    });
  };

  return (
    <div ref={(ref) => ref && connect(drag(ref))}>
      {imageSrc ? (
        <ImageComponent
          imageSrc={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
      ) : (
        <AddPhotoPopover
          onFileSelect={onFileSelect}
          onUrlSelect={onUrlSelect}
          addPhotoButton={1}
          currentImageSrc={undefined}
        />
      )}
    </div>
  );
};

Image.craft = {
  props: {
    imageSrc: "",
  },
  related: {
    settings: ImageSettings,
  },
};

export default Image;
