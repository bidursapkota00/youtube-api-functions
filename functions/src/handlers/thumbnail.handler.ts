import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import {
  generateUploadSignedUrl,
  generateDownloadSignedUrl,
} from "../services/storage/storage.service";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { courseThumbnailsBucketName } from "../config/firebase";

export const generateThumbnailUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    try {
      const { uid } = await checkAuthAndOwner(request);

      const data = request.data;

      if (!data || !String(data.fileExtension).trim())
        throw new HttpsError("invalid-argument", "fileExtension is required");

      return await generateUploadSignedUrl(
        uid,
        data.fileExtension,
        courseThumbnailsBucketName
      );
    } catch (error) {
      logger.error("Error creating file upload url:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create file upload url");
    }
  }
);

export const generateThumbnailDownloadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    try {
      const data = request.data;

      if (!data || !String(data.fileName).trim())
        throw new HttpsError("invalid-argument", "fileName is required");

      return await generateDownloadSignedUrl(
        data.fileName,
        courseThumbnailsBucketName
      );
    } catch (error) {
      logger.error("Error creating file download url:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create file download url");
    }
  }
);
