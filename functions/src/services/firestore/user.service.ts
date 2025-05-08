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
 * Verifies that the request is authenticated and the user has owner role.
 * @param {CallableRequest} request - The callable function request.
 * @return {Promise<void>} A promise that resolves if authorized or throws an error.
 * @throws {HttpsError} If the user is not authenticated or lacks owner permissions.
 */
export async function checkAuthAndOwner(
  request: CallableRequest
): Promise<{ uid: string; success: true }> {
  if (!request.auth)
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  const uid = request.auth.uid;

  const userDoc = await firestore.collection(userCollectionId).doc(uid).get();
  if (!userDoc.exists)
    throw new HttpsError("not-found", "User document not found");
  const userData = userDoc.data() as User;
  if (userData.role !== "owner")
    throw new HttpsError("permission-denied", "User is not an owner");
  return { uid, success: true };
}
