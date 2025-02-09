import { useEditor } from "@craftjs/core";
import React from "react";
import { useSaveEditor } from "./hooks/useSaveEditor";
import { useSaveImages } from "./hooks/useSaveImages";
import { imageStore } from "./store/images.store";
import { useDeleteImages } from "./hooks/useDeleteImages";
export const Navbar: React.FC = () => {
  const { store } = useEditor();
  const { mutate: saveEditor } = useSaveEditor();
  const { mutateAsync: saveImages } = useSaveImages();
  const { mutateAsync: deleteImages } = useDeleteImages();
  const save = async (): Promise<void> => {
    try {
      // First, upload pending images if any
      if (imageStore.images.length > 0) {
        await deleteImages(imageStore.images);
        console.log(imageStore.images);
        const uploadedUrls = await saveImages(imageStore.images);
        await deleteImages(imageStore.images);
        console.log("Uploaded image URLs:", uploadedUrls);

        // Update images with uploaded URLs
        imageStore.images.map((img) => {
          const uploadedUrl = uploadedUrls.find((url) => url === img.value);
          console.log(uploadedUrl);
          return uploadedUrl ? { ...img, uploaded: true, uploadedUrl } : img;
        });

        // 🔹 Update the Craft.js editor to replace preview URLs with uploaded ones
        Object.entries(store.query.getNodes()).forEach(([nodeId, node]) => {
          if (!node.data.props || !node.data.props.src) return;

          const nodesrc = node.data.props.src;
          const uploadedImage = imageStore.images.find(
            (img) => img.previewUrl === nodesrc,
          );

          if (uploadedImage?.uploadedUrl) {
            store.actions.setProp(nodeId, (props) => {
              props.src = uploadedImage.uploadedUrl;
            });
          }
        });
      }

      // Then save the editor state
      console.log({
        nodes: store.query.getNodes(),
      });

      await saveEditor({
        id: "af9a001974655fc48685d003525a3584",
        editor: {
          name: "Dev Editor",
          state: store.query.serialize(),
        },
      });
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  // Get count of unuploaded images
  const unuploadedCount = imageStore.images.filter(
    (img) => !img.uploaded,
  ).length;

  return (
    <nav className="bg-white border-b border-b-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and branding */}
          <div className="flex items-center">
            <div className="flex-shrink-0">Editor</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Navigation Links */}
                <button
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  onClick={save}
                  type="button"
                >
                  Save
                </button>

                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  About
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  Services
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  href="/"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="mr-2 flex md:hidden">
            <button
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 6h16M4 12h16m-7 6h7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
