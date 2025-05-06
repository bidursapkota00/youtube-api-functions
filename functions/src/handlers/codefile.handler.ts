// src/handlers/video.handler.ts
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { generateSignedUrl } from "../services/storage/storage.service";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { codeFilesBucketName } from "../config/firebase";

export const generateCodeFileUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    try {
      await checkAuthAndOwner(request);

      const uid = request.auth!.uid;
      const data = request.data;

      if (!data || !String(data.fileExtension).trim()) {
        throw new HttpsError("invalid-argument", "fileExtension is required");
      }

      return await generateSignedUrl(
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
