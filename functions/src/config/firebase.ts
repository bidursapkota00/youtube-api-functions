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
// Buckets
export const rawVideoBucketName = "codeyalaya-yt-raw-videos";
export const courseThumbnailsBucketName = "codeyalaya-course-thumbnails";
export const codeFilesBucketName = "codeyalaya-code-files";
// Firestore Collections
export const userCollectionId = "users";
export const courseCollectionId = "courses";
export const chapterCollectionId = "chapters";
export const lessonCollectionId = "lessons";
export const videoCollectionId = "videos";
