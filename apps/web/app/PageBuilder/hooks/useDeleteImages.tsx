import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { imageStore } from "../store/images.store";
import { API_URL } from "./types";

interface PendingImage {
  type: "file" | "url";
  value: File | string;
  previewUrl: string;
  uploaded: boolean;
  uploadedUrl?: string;
  active?: boolean;
}

export const useDeleteImages = () => {
  return useMutation({
    mutationFn: async (images: PendingImage[]) => {
      const unactiveImages = images.filter((img) => !img.active);

      if (unactiveImages.length === 0) return;

      await Promise.all(
        unactiveImages.map(async (image) => {
          if (image.uploaded && image.uploadedUrl) {
            try {
              const response = await axios.delete(
                `${API_URL}/file${image.uploadedUrl.substring(29)}`,
              );
              console.log("Deleted:", response.data);
            } catch (err) {
              console.error("Error deleting file:", err);
            }
            imageStore.pendingImages = imageStore.pendingImages.filter(
              (im) => im.active === true || im.uploaded === true,
            );
          }
        }),
      );
    },
  });
};
