import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { compressImage } from "./imageCompression";

/**
 * Upload a file to Firebase Storage and return the download URL.
 * @param {File} file - The file to upload
 * @param {string} folder - The storage folder (default: "images")
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<string>} The download URL
 */
export async function uploadImage(file, folder = "images", onProgress) {
  if (!file) throw new Error("No file provided");

  try {
    const compressedFile = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      maxSizeMB: 2,
    });

    const timestamp = Date.now();
    const safeName = compressedFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Compression failed, uploading original:", error);
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const storageRef = ref(storage, `${folder}/${timestamp}_${safeName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }
}
