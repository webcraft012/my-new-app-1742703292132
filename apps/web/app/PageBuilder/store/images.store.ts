import { makeAutoObservable } from "mobx";
interface PendingImage {
  type: "file" | "url";
  value: File | string;
  previewUrl: string;
  uploaded: boolean;
  uploadedUrl?: string;
}

class ImageStore {
  pendingImages: PendingImage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addImage(image: PendingImage) {
    this.pendingImages.push(image);
  }
}

export const imageStore = new ImageStore();
