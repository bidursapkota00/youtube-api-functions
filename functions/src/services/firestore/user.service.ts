import * as logger from "firebase-functions/logger";
import { firestore, userCollectionId } from "../../config/firebase";
import { User } from "../../models/user.model";
import { CallableRequest, FunctionsErrorCode } from "firebase-functions/https";

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
    logger.error("Error writing User to Firestore:", { message: errorMessage });
    return { success: false, error: errorMessage };
  }
};

export async function isOwner(uid: string): Promise<boolean> {
  try {
    const userDoc = await firestore.collection(userCollectionId).doc(uid).get();
    if (!userDoc.exists) return false;
    const userData = userDoc.data() as User;
    return userData.role === "owner";
  } catch (error) {
    logger.error("Error checking user role:", error);
    return false;
  }
}

export async function checkAuthAndOwner(request: CallableRequest): Promise<{
  success: boolean;
  errorCode?: FunctionsErrorCode;
  error?: string;
}> {
  if (!request.auth) {
    return {
      success: false,
      errorCode: "unauthenticated",
      error: "The function must be called while authenticated.",
    };
  }
  const owner = await isOwner(request.auth.uid);
  if (!owner)
    return {
      success: false,
      errorCode: "permission-denied",
      error: "Only owners can create chapters.",
    };
  return { success: true };
}
