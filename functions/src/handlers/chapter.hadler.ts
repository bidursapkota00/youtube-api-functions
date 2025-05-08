import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { createChapterInFirestore } from "../services/firestore/chapter.service";
import {
  createChapterObject,
  validateChapterDataFromAPI,
} from "../models/chapter.model";

export const createChapter = onCall({ maxInstances: 1 }, async (request) => {
  try {
    const { uid } = await checkAuthAndOwner(request);

    const chapterData = request.data;

    const validationError = validateChapterDataFromAPI(chapterData);
    if (validationError)
      throw new HttpsError("invalid-argument", validationError);

    const chapter = createChapterObject(chapterData);

    return await createChapterInFirestore(chapter, uid);
  } catch (error) {
    logger.error("Error creating chapter:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create chapter");
  }
});
