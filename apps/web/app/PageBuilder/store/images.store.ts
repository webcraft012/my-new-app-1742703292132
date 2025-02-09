import { makeAutoObservable } from "mobx";
import { SelectedImage } from "./types/image";

class ImageStore {
  images: SelectedImage[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addImage(image: SelectedImage) {
    this.images.push(image);
  }
}

export const imageStore = new ImageStore();
