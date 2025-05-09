import { HttpsError } from "firebase-functions/v2/https";
import {
  firestore,
  chapterCollectionId,
  courseCollectionId,
  lessonCollectionId,
} from "../../config/firebase";
import { Chapter } from "../../models/chapter.model";
import { Course } from "../../models/course.model";
import { Lesson } from "../../models/lesson.model";

export const createLessonInFirestore = async (
  lesson: Lesson,
  uid: string
): Promise<{ success: true; lessonId: string }> => {
  const chapterRef = firestore
    .collection(chapterCollectionId)
    .doc(lesson.chapterId);
  const chapterDoc = await chapterRef.get();

  if (!chapterDoc.exists)
    throw new HttpsError("not-found", "Chapter not found.");

  const chapterData = chapterDoc.data() as Chapter;

  const courseRef = firestore
    .collection(courseCollectionId)
    .doc(chapterData.courseId);
  const courseDoc = await courseRef.get();

  if (!courseDoc.exists) throw new HttpsError("not-found", "Course not found.");

  const courseData = courseDoc.data() as Course;
  if (courseData.createdBy !== uid)
    throw new HttpsError(
      "permission-denied",
      "You can only add lessons to your own courses."
    );

  const lessonRef = await firestore.collection(lessonCollectionId).add(lesson);
  await lessonRef.update({ id: lessonRef.id });

  return {
    success: true,
    lessonId: lessonRef.id,
  };
};
