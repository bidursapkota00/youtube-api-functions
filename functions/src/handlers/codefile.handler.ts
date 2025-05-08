// src/handlers/video.handler.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { generateUploadSignedUrl } from "../services/storage/storage.service";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { codeFilesBucketName } from "../config/firebase";

export const generateCodeFileUploadUrl = onCall(
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
        codeFilesBucketName
      );
    } catch (error) {
      logger.error("Error creating file upload url:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create file upload url");
    }
  }
);
