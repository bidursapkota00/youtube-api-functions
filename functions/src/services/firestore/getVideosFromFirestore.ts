import { firestore, videoCollectionId } from "../../config/firebase";
import { Lesson } from "../../models/lesson.model";

export const getVideosFromFirestore = async (limit = 10): Promise<Lesson[]> => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Lesson);
};
