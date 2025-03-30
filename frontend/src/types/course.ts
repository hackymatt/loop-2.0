import type { DatePickerFormat } from "src/utils/format-time";

// ----------------------------------------------------------------------

export type ICourseLevelProp = {
  slug: string;
  name: string;
};

export type ICourseTechnologyProp = {
  slug: string;
  name: string;
};

export type ICourseCategoryProp = {
  slug: string;
  name: string;
};

export type ICourseTeacherProp = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type ICourseLessonType = "video" | "article" | "exercise" | "quiz";

export type ICourseLessonProp = {
  id: string;
  title: string;
  slug: string;
  type: ICourseLessonType;
  totalPoints: number;
};

export type ICourseChapterProp = {
  id: string;
  title: string;
  slug: string;
  description: string;
  lessons: ICourseLessonProp[];
};

export type ICourseByCategoryProps = {
  id: string;
  name: string;
  totalStudents: number;
};

export type ICourseProps = {
  id: string;
  slug: string;
  title: string;
  level: ICourseLevelProp;
  chatUrl: string;
  category: ICourseCategoryProp;
  technology: ICourseTechnologyProp;
  totalPoints: number;
  totalHours: number;
  description: string;
  overview: string;
  ratingNumber: number;
  totalQuizzes: number;
  totalExercises: number;
  totalVideos: number;
  totalReviews: number;
  createdAt: DatePickerFormat;
  totalStudents: number;
  chapters: ICourseChapterProp[];
  teachers: ICourseTeacherProp[];
};

export type ICourseFiltersProps = {
  levels: string[];
  technologies: string[];
  categories: string[];
  rating: string | null;
};
