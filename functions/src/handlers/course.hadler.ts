import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions/v1";
import { isOwner } from "../services/firestore/user.service";
import { createCourseInFirestore } from "../services/firestore/course.service";
import { createCourseObject } from "../models/course.model";

export const createCourse = onCall({ maxInstances: 1 }, async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = request.auth.uid;
  const courseData = request.data;

  // Check if the user is an owner
  if (!(await isOwner(uid))) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only owners can create courses."
    );
  }

  const course = createCourseObject({ ...courseData, createdBy: uid });

  return createCourseInFirestore(course);
});
