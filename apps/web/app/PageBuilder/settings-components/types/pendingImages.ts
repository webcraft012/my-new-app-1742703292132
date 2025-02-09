export interface PendingImage {
  type: "file" | "url";
  value: File | string;
  previewUrl: string;
  uploaded: boolean;
  uploadedUrl?: string;
  active?: boolean;
}
