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
