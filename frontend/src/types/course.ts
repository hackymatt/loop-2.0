import type { DatePickerFormat } from "src/utils/format-time";

import type { ISocialLinks } from "./socials";

// ----------------------------------------------------------------------

export type ICourseTeacherProp = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  ratingNumber: number;
  totalCourses: number;
  totalReviews: number;
  totalStudents: number;
};

export type ICourseLessonProp = {
  id: string;
  title: string;
  duration: number;
  videoPath: string;
  unLocked: boolean;
  description: string;
};

export type ICourseByCategoryProps = {
  id: string;
  name: string;
  totalStudents: number;
};

export type ICourseProps = {
  id: string;
  slug: string;
  price: number;
  level: string;
  coverUrl: string;
  technology: string;
  category: string;
  skills: string[];
  priceSale: number;
  resources: number;
  totalHours: number;
  description: string;
  languages: string[];
  learnList: string[];
  ratingNumber: number;
  totalQuizzes: number;
  totalReviews: number;
  isBestSeller: boolean;
  createdAt: DatePickerFormat;
  totalStudents: number;
  shareLinks: ISocialLinks;
  lessons: ICourseLessonProp[];
  teachers: ICourseTeacherProp[];
};

export type ICourseFiltersProps = {
  levels: string[];
  technologies: string[];
  categories: string[];
  rating: string | null;
};
