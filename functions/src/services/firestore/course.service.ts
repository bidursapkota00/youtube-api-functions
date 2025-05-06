import { firestore, courseCollectionId } from "../../config/firebase";
import { Course } from "../../models/course.model";

export const createCourseInFirestore = async (
  course: Course
): Promise<{ success: true; courseId: string }> => {
  const courseRef = await firestore.collection(courseCollectionId).add(course);

  await courseRef.update({ id: courseRef.id });

  return {
    success: true,
    courseId: courseRef.id,
  };
};
