import {
  firestore,
  courseCollectionId,
  chapterCollectionId,
} from "../../config/firebase";
import { Chapter } from "../../models/chapter.model";
import { Course } from "../../models/course.model";
import { HttpsError } from "firebase-functions/v2/https";

export const createChapterInFirestore = async (
  chapter: Chapter,
  uid: String
): Promise<{ success: true; chapterId: string }> => {
  const courseRef = firestore
    .collection(courseCollectionId)
    .doc(chapter.courseId);
  const courseDoc = await courseRef.get();

  if (!courseDoc.exists) throw new HttpsError("not-found", "Course not found.");

  const courseData = courseDoc.data() as Course;
  if (courseData.createdBy !== uid)
    throw new HttpsError(
      "permission-denied",
      "You can only add chapters to your own courses."
    );

  const chapterRef = await firestore
    .collection(chapterCollectionId)
    .add(chapter);

  await chapterRef.update({ id: chapterRef.id });

  return {
    success: true,
    chapterId: chapterRef.id,
  };
};
