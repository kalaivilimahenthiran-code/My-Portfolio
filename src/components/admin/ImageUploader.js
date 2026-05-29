"use client";
import { useState } from "react";
import { HiOutlineUpload, HiX, HiCloudUpload, HiFolder } from "react-icons/hi";
import { uploadImage } from "@/lib/uploadImage";
import toast from "react-hot-toast";

export default function ImageUploader({ value, onChange, folder = "images", useLocalStorage = false }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);

  const handleFirebaseUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    const url = await uploadImage(file, folder, (progress) => {
      setUploadProgress(progress);
    });
    return url;
  };

  const handleLocalUpload = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload/local", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Local upload failed");
    }

    const data = await response.json();
    return data.url;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const url = useLocalStorage ? await handleLocalUpload(file) : await handleFirebaseUpload(file);
      onChange(url);
      setPreview(null);
      toast.success("Image uploaded!");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed.");
      setPreview(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setUploadProgress(0);
    setUploading(false);
  };

  if (value) {
    return (
      <div className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="Uploaded" className="h-32 w-auto object-cover rounded-xl border border-white/10" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <HiX size={16} />
        </button>
      </div>
    );
  }

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-xl border border-white/10" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center">
              <div className="w-full px-4">
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-white text-xs text-center">{uploadProgress}%</p>
              </div>
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={handleCancel}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <HiX size={16} />
            </button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-cyan-400 transition-colors">
            {useLocalStorage ? (
              <HiFolder size={28} className="mb-2" />
            ) : (
              <HiCloudUpload size={28} className="mb-2" />
            )}
            <p className="text-sm font-medium">
              {uploading
                ? `Uploading... ${uploadProgress}%`
                : useLocalStorage
                ? "Click to upload to local folder"
                : "Click to upload to cloud"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {useLocalStorage ? `/${folder}` : "Firebase Storage"}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
