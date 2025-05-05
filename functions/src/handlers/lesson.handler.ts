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
    const authResult = await checkAuthAndOwner(request);
    if (!authResult.success)
      throw new HttpsError(
        authResult.errorCode || "permission-denied",
        authResult.error || "Failed Checking authentication"
      );

    const uid = request.auth!.uid;
    const lessonData = request.data;

    const validationError = validateLessonDataFromAPI(lessonData);
    if (validationError) {
      throw new HttpsError("invalid-argument", validationError);
    }

    const lesson = createLessonObject(lessonData);

    const result = await createLessonInFirestore(lesson, uid);

    if (!result.success) {
      throw new HttpsError(
        result.errorCode || "internal",
        result.error || "Failed to create lesson"
      );
    }

    return result;
  } catch (error) {
    logger.error("Error in createLesson:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError(
      "internal",
      "An internal error occurred while creating the lesson."
    );
  }
});
