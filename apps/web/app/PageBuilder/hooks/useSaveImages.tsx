import axios from "axios";
import { API_URL } from "./types";
import { useMutation } from "@tanstack/react-query";

import { SelectedImage } from "../store/types/image";

export const useSaveImages = () => {
  return useMutation({
    mutationFn: async (images: SelectedImage[]) => {
      // Filter out already uploaded images
      const unuploadedImages = images.filter((img) => !img.uploaded);

      if (unuploadedImages.length === 0) {
        return images.map((img) => img.uploadedUrl || img.value);
      }

      return await Promise.all(
        unuploadedImages.map(async (image) => {
          if (image.type === "url") {
            console.log("Image is a URL:", image.value);
            return image.value as string;
          }

          const formData = new FormData();
          formData.append("file", image.value as File);

          try {
            const response = await axios.post(`${API_URL}/file`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });

            // Update the image object with the uploaded URL
            image.uploaded = true;
            image.uploadedUrl = response.data.fileUrl;

            return response.data.fileUrl;
          } catch (error) {
            console.error("Upload failed", error);
            return null;
          }
        }),
      ).then((uploadedUrls) => {
        console.log("Final uploadedUrls:", uploadedUrls);
        return uploadedUrls.filter((url) => url !== null); // Filter out failed uploads
      });
    },
  });
};
