import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v1";
import {
  firestore,
  courseCollectionId,
  chapterCollectionId,
} from "../../config/firebase";
import { Chapter } from "../../models/chapter.model";
import { Course } from "../../models/course.model";

export const createChapterInFirestore = async (
  chapter: Chapter,
  uid: String
): Promise<{ success: boolean; chapterId?: string; error?: string }> => {
  try {
    // Verify the course exists and is owned by this user
    const courseRef = firestore
      .collection(courseCollectionId)
      .doc(chapter.courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Course not found.");
    }

    const courseData = courseDoc.data() as Course;
    if (courseData.createdBy !== uid) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You can only add chapters to your own courses."
      );
    }

    // Add chapter to Firestore
    const chapterRef = await firestore
      .collection(chapterCollectionId)
      .add(chapter);

    // Update the chapter with its ID
    await chapterRef.update({ id: chapterRef.id });

    return {
      success: true,
      chapterId: chapterRef.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error("Error creating chapter:", { message: errorMessage });
    return {
      success: false,
      error: errorMessage,
    };
  }
};
