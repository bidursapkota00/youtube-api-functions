import { logger } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { createLessonInFirestore } from "../services/firestore/lesson.service";
import {
  createLessonObject,
  validateLessonDataFromAPI,
} from "../models/lesson.model";

export const createLesson = onCall({ maxInstances: 1 }, async (request) => {
  try {
    const { uid } = await checkAuthAndOwner(request);

    const lessonData = request.data;

    const validationError = validateLessonDataFromAPI(lessonData);
    if (validationError)
      throw new HttpsError("invalid-argument", validationError);

    const lesson = createLessonObject(lessonData);

    return await createLessonInFirestore(lesson, uid);
  } catch (error) {
    logger.error("Error in createLesson:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError(
      "internal",
      "An internal error occurred while creating the lesson."
    );
  }
});
