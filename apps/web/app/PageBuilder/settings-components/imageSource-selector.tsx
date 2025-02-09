"use client";
import { useEditor } from "@craftjs/core";
import { useState } from "react";
import AddPhotoPopover from "../ui/addPhotoPopover";
import { on } from "events";
import { imageStore } from "../store/images.store";
export const ImageSourceSelector: React.FC<ImageSourceSelectorProps> = ({
  onChange,
  defaultValue,
}) => {
  const onFileSelect = (file: File | null) => {
    if (!file || !(file instanceof File)) {
      console.error("Invalid file selected:", file);
      return;
    }
    console.log("defaultvalue :", defaultValue);
    imageStore.pendingImages.map((image) => {
      if (image.uploadedUrl == defaultValue) {
        image.active = false;
      }
      if (image.previewUrl == defaultValue) {
        image.active = false;
      }
    });
    const previewUrl = URL.createObjectURL(file);
    imageStore.addImage({
      type: "file",
      value: file,
      previewUrl,
      uploaded: false,
      active: true,
    });
    onChange?.(previewUrl);
  };

  const onUrlSelect = (url: string) => {
    imageStore.pendingImages.map((image) => {
      if (image.uploadedUrl == defaultValue) {
        image.active = false;
      }
      if (image.previewUrl == defaultValue) {
        image.active = false;
      }
    });
    imageStore.addImage({
      type: "url",
      value: url,
      previewUrl: url,
      uploaded: false,
      active: true,
    });
    onChange?.(url);
  };

  return (
    <>
      <AddPhotoPopover
        onFileSelect={onFileSelect}
        onUrlSelect={onUrlSelect}
        addPhotoButton={0}
        currentImageSrc={defaultValue}
      ></AddPhotoPopover>
    </>
  );
};

interface ImageSourceSelectorProps {
  defaultValue?: string | undefined;
  onChange?: (value: string) => void;
}
