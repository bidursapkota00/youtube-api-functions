import { onUserCreate } from "./handlers/user.handler";
import { generateUploadUrl, getVideos } from "./handlers/video.handler";
import { generateCodeFileUploadUrl } from "./handlers/codefile.handler";
import { generateThumbnailUploadUrl } from "./handlers/thumbnail.handler";
import { createCourse } from "./handlers/course.hadler";
// Auth functions
export const createUser = onUserCreate;

// Video functions
export { generateUploadUrl, getVideos };

export { generateCodeFileUploadUrl, generateThumbnailUploadUrl };

export { createCourse };
