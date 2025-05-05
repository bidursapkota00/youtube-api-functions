// src/config/firebase.ts
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Storage } from "@google-cloud/storage";

// Initialize Firebase
initializeApp();

// Firebase services
export const firestore = getFirestore("codeyalaya");
export const storage = new Storage();

// Constants
export const rawVideoBucketName = "codeyalaya-yt-raw-videos";
export const videoCollectionId = "videos";
