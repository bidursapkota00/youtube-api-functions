// src/handlers/video.handler.ts
import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v1";
import { generateSignedUrl } from "../services/storage.service";
import { getVideosFromFirestore } from "../services/firestore.service";

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    const auth = request.auth;
    const data = request.data;

    return generateSignedUrl(auth.uid, data.fileExtension);
  }
);

export const getVideos = onCall({ maxInstances: 1 }, async () => {
  return getVideosFromFirestore();
});
