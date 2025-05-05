export interface Lesson {
  id?: string;
  chapterId: string;
  courseId: string;
  title: string;
  description: string;
  filename: string;
  duration: number; // in seconds
  order: number;
  status: "processing" | "processed";
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export const createLessonObject = (lesson: any): Lesson => {
  const now = new Date().toISOString();
  return {
    chapterId: lesson.chapterId,
    courseId: lesson.courseId,
    title: lesson.title,
    description: lesson.description,
    filename: lesson.filename,
    duration: lesson.duration,
    order: lesson.order,
    status: "processing", // Initial status
    createdAt: now,
    updatedAt: now,
  };
};

export const validateLessonDataFromAPI = (data: any): string | null => {
  if (!data) return "Lesson data is required";
  if (!data.title) return "Lesson title is required";
  if (!data.description) return "Lesson description is required";
  if (!data.filename) return "Lesson filename is required";
  if (!data.duration) return "Lesson duration is required";
  if (!data.order) return "Lesson order is required";
  if (!data.chapterId) return "Chapter ID is required";
  if (!data.courseId) return "Course ID is required";
  return null;
};
