import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { createChapterInFirestore } from "../services/firestore/chapter.service";
import { createChapterObject } from "../models/chapter.model";

export const createChapter = onCall({ maxInstances: 1 }, async (request) => {
  try {
    const result = await checkAuthAndOwner(request);
    if (!result.success)
      throw new HttpsError(
        result.errorCode || "permission-denied",
        result.error || "Failed Checking authentication"
      );

    const uid = request.auth!.uid;
    const chapterData = request.data;

    const chapter = createChapterObject(chapterData);

    return createChapterInFirestore(chapter, uid);
  } catch (error) {
    logger.error("Error creating chapter:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to create chapter");
  }
});
