// src/services/firestore.service.ts
import * as logger from "firebase-functions/logger";
import { firestore, videoCollectionId } from "../config/firebase";
import { User } from "../models/user.model";
import { Video } from "../models/video.model";

export const createUserInFirestore = async (
  userData: User
): Promise<{ success: boolean; error?: string }> => {
  try {
    await firestore.collection("users").doc(userData.uid).set(userData);
    logger.info(`User Created: ${JSON.stringify(userData)}`);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    logger.error("Error writing to Firestore:", { message: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export const getVideosFromFirestore = async (limit = 10): Promise<Video[]> => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Video);
};
