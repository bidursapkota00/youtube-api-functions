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
