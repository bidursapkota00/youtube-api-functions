import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { generateSignedUrl } from "../services/storage/storage.service";
import { getVideosFromFirestore } from "../services/firestore/getVideosFromFirestore";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { rawVideoBucketName } from "../config/firebase";

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    try {
      await checkAuthAndOwner(request);

      const uid = request.auth!.uid;
      const data = request.data;

      if (!data || !String(data.fileExtension).trim())
        throw new HttpsError("invalid-argument", "fileExtension is required");

      return await generateSignedUrl(
        uid,
        data.fileExtension,
        rawVideoBucketName
      );
    } catch (error) {
      logger.error("Error creating video upload url:", error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError("internal", "Failed to create video upload url");
    }
  }
);

export const getVideos = onCall({ maxInstances: 1 }, async () => {
  try {
    return getVideosFromFirestore();
  } catch (error) {
    logger.error("Error creating video upload url:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create video upload url");
  }
});
