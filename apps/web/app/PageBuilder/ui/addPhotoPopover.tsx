import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Camera, Link, Upload, X } from "lucide-react";
import axios from "axios"; // Axios for making HTTP requests
import { API_URL } from "../hooks/types";
export default function AddPhotoPopover({
  onFileSelect,
  onUrlSelect,
  addPhotoButton,
  currentsrc,
}) {
  const [uploadMode, setUploadMode] = useState<"upload" | "link" | null>(null);
  const [src, setsrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidUrl = (url) => {
    try {
      new URL(url); // Checks if the URL is valid
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return;
      }
      onFileSelect(file);
    }
  };

  const handleLinkChange = (e) => {
    setsrc(e.target.value);
    setError(""); // Clear any previous error when the user starts typing
  };

  const handleUseImage = () => {
    if (isValidUrl(src)) {
      onUrlSelect(src); // Send to parent
      setError(""); // Clear error if valid
    } else {
      setError("Please provide a valid URL."); // Set error message if invalid
    }
  };

  const clearImage = () => {
    if (addPhotoButton) {
      setsrc("");
      setError("");
      onFileSelect("");
      onUrlSelect("");
    }
    setUploadMode(null);
  };

  return (
    <div className="inline-block relative  overflow-auto">
      <Popover>
        {addPhotoButton ? (
          <PopoverTrigger>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 shadow-lg sm:w-[400px] w-[200px] justify-center ">
              <Camera size={18} />
              <span>Add Image</span>
            </button>
          </PopoverTrigger>
        ) : (
          <PopoverTrigger>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border  hover:bg-gray-100 text-base text-black rounded-md transition-colors duration-200 shadow-lg  justify-center ">
              <Camera size={18} />
              <span>Replace Image</span>
            </button>
          </PopoverTrigger>
        )}
        {currentsrc != "" && (
          <PopoverContent
            avoidCollisions={false}
            align="center"
            side="bottom"
            forceMount
            className="w-72 p-4 bg-white border rounded-lg shadow-lg"
          >
            {!uploadMode ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setUploadMode("upload")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload size={24} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Upload
                  </span>
                </button>

                <button
                  onClick={() => setUploadMode("link")}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <Link size={24} className="text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Link
                  </span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    {uploadMode === "upload" ? "Upload Image" : "Image URL"}
                  </h3>
                  <button
                    onClick={clearImage}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>

                {uploadMode === "upload" && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      onChange={handleFileChange}
                    />
                    {error && (
                      <p className="mt-2 text-sm ml-7 text-red-500">{error}</p>
                    )}
                  </div>
                )}

                {uploadMode === "link" && (
                  <>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onChange={handleLinkChange}
                    />
                    <button
                      className="w-full mt-2 p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                      onClick={handleUseImage}
                    >
                      Use this image
                    </button>
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
