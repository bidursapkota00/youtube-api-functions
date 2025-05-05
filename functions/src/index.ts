import { onUserCreate } from "./handlers/auth.handler";
import { generateUploadUrl, getVideos } from "./handlers/video.handler";

// Auth functions
export const createUser = onUserCreate;

// Video functions
export { generateUploadUrl, getVideos };
