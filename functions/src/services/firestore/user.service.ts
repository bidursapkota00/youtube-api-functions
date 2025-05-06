import { logger } from "firebase-functions/v2";
import { HttpsError } from "firebase-functions/v2/https";
import { firestore, userCollectionId } from "../../config/firebase";
import { User } from "../../models/user.model";
import { CallableRequest } from "firebase-functions/https";

export const createUserInFirestore = async (
  userData: User
): Promise<{ success: true }> => {
  await firestore.collection("users").doc(userData.uid).set(userData);
  logger.info(`User Created: ${JSON.stringify(userData)}`);
  return { success: true };
};

/**
 * Checks if a user has owner role.
 * @param {string} uid - The user ID to check.
 * @return {Promise<boolean>} A promise that resolves to true if user is an owner, false otherwise.
 */
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

/**
 * Verifies that the request is authenticated and the user has owner role.
 * @param {CallableRequest} request - The callable function request.
 * @return {Promise<void>} A promise that resolves if authorized or throws an error.
 * @throws {HttpsError} If the user is not authenticated or lacks owner permissions.
 */
export async function checkAuthAndOwner(
  request: CallableRequest
): Promise<void> {
  if (!request.auth)
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  const owner = await isOwner(request.auth.uid);
  if (!owner)
    throw new HttpsError(
      "permission-denied",
      "You donot have enough permission to do this operation"
    );
}
