import { makeAutoObservable } from "mobx";
interface PendingImage {
  type: "file" | "url";
  value: File | string;
  previewUrl: string;
  uploaded: boolean;
  uploadedUrl?: string;
  active?: boolean;
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
