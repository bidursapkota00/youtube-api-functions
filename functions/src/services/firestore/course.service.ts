import * as logger from "firebase-functions/logger";
import { firestore, courseCollectionId } from "../../config/firebase";
import { Course } from "../../models/course.model";

export const createCourseInFirestore = async (
  course: Course
): Promise<{ success: boolean; courseId?: string; error?: string }> => {
  try {
    const courseRef = await firestore
      .collection(courseCollectionId)
      .add(course);

    // Update the course with its ID
    await courseRef.update({ id: courseRef.id });

    return {
      success: true,
      courseId: courseRef.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error("Error creating course:", { message: errorMessage });
    return { success: false, error: errorMessage };
  }
};
