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
    createdBy: course.createdBy,
    createdAt: now,
    updatedAt: now,
  };
};

export const validateCourseDataFromAPI = (data: any): string | null => {
  if (!data) return "Course data is required";
  if (!data.title) return "Course title is required";
  if (!data.description) return "Course description is required";
  if (!data.thumbnailUrl) return "Thumbnail url is required";
  if (!data.hours) return "Hours is required";
  if (!data.level) return "Course difficulty Level is required";
  return null;
};
