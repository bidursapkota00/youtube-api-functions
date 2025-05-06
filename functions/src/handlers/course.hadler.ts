import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { createCourseInFirestore } from "../services/firestore/course.service";
import {
  createCourseObject,
  validateCourseDataFromAPI,
} from "../models/course.model";

export const createCourse = onCall({ maxInstances: 1 }, async (request) => {
  try {
    await checkAuthAndOwner(request);

    const uid = request.auth!.uid;
    const courseData = request.data;

    const validationError = validateCourseDataFromAPI(courseData);
    if (validationError) {
      throw new HttpsError("invalid-argument", validationError);
    }

    const course = createCourseObject({ ...courseData, createdBy: uid });

    return await createCourseInFirestore(course);
  } catch (error) {
    logger.error("Error creating course:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create course");
  }
});
