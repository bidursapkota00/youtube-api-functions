import { onUserCreate } from "./handlers/user.handler";
import { generateUploadUrl, getVideos } from "./handlers/video.handler";
import { generateCodeFileUploadUrl } from "./handlers/codefile.handler";
import { generateThumbnailUploadUrl } from "./handlers/thumbnail.handler";
import {
  createCourse,
  getCourses,
  getCourseWithContent,
} from "./handlers/course.hadler";
import { createChapter } from "./handlers/chapter.hadler";
import { createLesson } from "./handlers/lesson.handler";
import { isOwner } from "./handlers/user.handler";

// Auth functions
export const createUser = onUserCreate;
export { isOwner };

// Video functions
export { generateUploadUrl, getVideos };

export { generateCodeFileUploadUrl, generateThumbnailUploadUrl };

export { createCourse, createChapter, createLesson };

export { getCourses, getCourseWithContent };
