export interface SelectedImage {
  type: "file" | "url";
  value: File | string;
  previewUrl: string;
  uploaded: boolean;
  uploadedUrl?: string;
  active?: boolean;
}
