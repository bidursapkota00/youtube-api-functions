export interface Chapter {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  starterCodeUrl?: string;
  finalCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const createChapterObject = (chapter: any): Chapter => {
  const now = new Date().toISOString();
  return {
    courseId: chapter.courseId,
    title: chapter.title,
    description: chapter.description,
    order: chapter.order,
    starterCodeUrl: chapter.starterCodeUrl,
    finalCodeUrl: chapter.finalCodeUrl,
    createdAt: now,
    updatedAt: now,
  };
};

export const validateChapterDataFromAPI = (data: any): string | null => {
  if (!data) return "Chapter data is required";
  if (!data.title) return "Chapter title is required";
  if (!data.description) return "Chapter description is required";
  if (!data.order) return "Chapter order is required";
  if (!data.courseId) return "Course ID is required";
  return null;
};
