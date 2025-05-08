// src/services/storage.service.ts
import { storage } from "../../config/firebase";

export const generateUploadSignedUrl = async (
  userId: string,
  fileExtension: string,
  bucketName: string
): Promise<{ url: string; fileName: string }> => {
  const bucket = storage.bucket(bucketName);

  const fileName = `${userId}-${Date.now()}.${fileExtension}`;

  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 60 * 60 * 1000,
  });

  return { url, fileName };
};

export const generateDownloadSignedUrl = async (
  fileName: string,
  bucketName: string
): Promise<{ url: string }> => {
  const bucket = storage.bucket(bucketName);

  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 60 * 60 * 1000,
  });

  return { url };
};
