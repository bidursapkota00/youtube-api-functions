import { HttpsError, onCall } from "firebase-functions/v2/https";
import { auth } from "firebase-functions/v1";
import { logger } from "firebase-functions/v2";
import { createUserObject } from "../models/user.model";
import {
  createUserInFirestore,
  checkAuthAndOwner,
} from "../services/firestore/user.service";

export const onUserCreate = auth.user().onCreate(async (user) => {
  try {
    if (!user || !user.uid)
      throw new HttpsError("invalid-argument", "user data is required");

    const userInfo = createUserObject(user);
    return await createUserInFirestore(userInfo);
  } catch (error) {
    logger.error("Error creating user in firestore:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create user in firestore");
  }
});

export const isOwner = onCall({ maxInstances: 1 }, async (request) => {
  try {
    return await checkAuthAndOwner(request);
  } catch (error) {
    logger.error("Error creating course:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create course");
  }
});
