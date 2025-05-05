export interface Course {
  id?: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  hours: number;
  level: "easy" | "medium" | "hard";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export const createCourseObject = (course: any): Course => {
  const now = new Date().toISOString();
  return {
    title: course.title,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    hours: course.hours,
    level: course.level,
    createdBy: course.uid,
    createdAt: now,
    updatedAt: now,
  };
};
