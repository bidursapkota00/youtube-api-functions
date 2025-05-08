import {
  firestore,
  courseCollectionId,
  chapterCollectionId,
  videoCollectionId,
} from "../config/firebase";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import { checkAuthAndOwner } from "../services/firestore/user.service";
import { createCourseInFirestore } from "../services/firestore/course.service";
import {
  Course,
  createCourseObject,
  validateCourseDataFromAPI,
} from "../models/course.model";
import { Chapter } from "../models/chapter.model";
import { Lesson } from "../models/lesson.model";

export const createCourse = onCall({ maxInstances: 1 }, async (request) => {
  try {
    const { uid } = await checkAuthAndOwner(request);
    const courseData = request.data;

    const validationError = validateCourseDataFromAPI(courseData);
    if (validationError)
      throw new HttpsError("invalid-argument", validationError);

    const course = createCourseObject({ ...courseData, createdBy: uid });

    return await createCourseInFirestore(course);
  } catch (error) {
    logger.error("Error creating course:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create course");
  }
});

export const getCourses = onCall({ maxInstances: 1 }, async (request) => {
  try {
    const snapshot = await firestore
      .collection(courseCollectionId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error("Error getting courses:", { message: errorMessage });
    throw new HttpsError("internal", errorMessage);
  }
});

export const getCourseWithContent = onCall(
  { maxInstances: 1 },
  async (request) => {
    const courseId = request.data.courseId;

    try {
      const courseDoc = await firestore
        .collection(courseCollectionId)
        .doc(courseId)
        .get();

      if (!courseDoc.exists)
        throw new HttpsError("not-found", "Course not found.");

      const courseData = courseDoc.data() as Course;

      const chaptersSnapshot = await firestore
        .collection(chapterCollectionId)
        .where("courseId", "==", courseId)
        .orderBy("order")
        .get();

      const chapters = chaptersSnapshot.docs.map(
        (doc) => doc.data() as Chapter
      );

      const videosSnapshot = await firestore
        .collection(videoCollectionId)
        .where("courseId", "==", courseId)
        .get();

      const videos = videosSnapshot.docs.map((doc) => doc.data() as Lesson);

      const chaptersWithVideos = chapters.map((chapter) => {
        const chapterVideos = videos
          .filter((video) => video.chapterId === chapter.id)
          .sort((a, b) => a.order - b.order);

        return {
          ...chapter,
          videos: chapterVideos,
        };
      });

      return {
        ...courseData,
        chapters: chaptersWithVideos,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      logger.error("Error getting course with content:", {
        message: errorMessage,
      });
      throw new HttpsError("internal", errorMessage);
    }
  }
);
