// src/handlers/video.handler.ts
import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v1";
import { generateSignedUrl } from "../services/storage/storage.service";
import { isOwner } from "../services/firestore/user.service";
import { courseThumbnailsBucketName } from "../config/firebase";

export const generateThumbnailUploadUrl = onCall(
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

    if (!(await isOwner(auth.uid))) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only owners can upload videos."
      );
    }

    return generateSignedUrl(
      auth.uid,
      data.fileExtension,
      courseThumbnailsBucketName
    );
  }
);
