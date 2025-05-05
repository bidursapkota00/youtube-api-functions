// src/handlers/auth.handler.ts
import * as functions from "firebase-functions/v1";
import * as logger from "firebase-functions/logger";
import { createUserObject } from "../models/user.model";
import { createUserInFirestore } from "../services/firestore/user.service";

export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  if (!user || !user.uid) {
    logger.error("Invalid user data received");
    return;
  }

  const userInfo = createUserObject(user);
  return createUserInFirestore(userInfo);
});
