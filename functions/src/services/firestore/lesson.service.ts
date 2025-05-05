import { FunctionsErrorCode } from "firebase-functions/https";
import {
  firestore,
  chapterCollectionId,
  courseCollectionId,
  videoCollectionId,
} from "../../config/firebase";
import { Chapter } from "../../models/chapter.model";
import { Course } from "../../models/course.model";
import { Lesson } from "../../models/lesson.model";

export const createLessonInFirestore = async (
  lesson: Lesson,
  uid: String
): Promise<{
  success: boolean;
  lessonId?: string;
  errorCode?: FunctionsErrorCode;
  error?: string;
}> => {
  const chapterRef = firestore
    .collection(chapterCollectionId)
    .doc(lesson.chapterId);
  const chapterDoc = await chapterRef.get();

  if (!chapterDoc.exists) {
    return {
      success: false,
      errorCode: "not-found",
      error: "Chapter not found.",
    };
  }

  const chapterData = chapterDoc.data() as Chapter;

  const courseRef = firestore
    .collection(courseCollectionId)
    .doc(chapterData.courseId);
  const courseDoc = await courseRef.get();

  if (!courseDoc.exists) {
    return {
      success: false,
      errorCode: "not-found",
      error: "Course not found.",
    };
  }

  const courseData = courseDoc.data() as Course;
  if (courseData.createdBy !== uid) {
    return {
      success: false,
      errorCode: "permission-denied",
      error: "You can only add videos to your own courses.",
    };
  }

  const lessonRef = await firestore.collection(videoCollectionId).add(lesson);
  await lessonRef.update({ id: lessonRef.id });

  return {
    success: true,
    lessonId: lessonRef.id,
  };
};
