// src/services/storage.service.ts
import { storage } from "../../config/firebase";

export const generateSignedUrl = async (
  userId: string,
  fileExtension: string,
  bucketName: string
): Promise<{ url: string; fileName: string }> => {
  const bucket = storage.bucket(bucketName);

  // Generate a unique filename
  const fileName = `${userId}-${Date.now()}.${fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  return { url, fileName };
};
