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

export type ICourseLessonType = "reading" | "video" | "quiz" | "coding";

export type ICourseLessonProp = {
  id: string;
  slug: string;
  name: string;
  type: ICourseLessonType;
  totalPoints: number;
};

export type ICourseChapterProp = {
  id: string;
  slug: string;
  name: string;
  description: string;
  lessons: ICourseLessonProp[];
};

export type ICourseProps = {
  id: string;
  slug: string;
  name: string;
  description: string;
  overview: string;
  level: ICourseLevelProp;
  category: ICourseCategoryProp;
  technology: ICourseTechnologyProp;
  chapters: ICourseChapterProp[];
  teachers: ICourseTeacherProp[];
  totalHours: number;
  chatUrl: string;

  // calculated
  totalPoints: number;

  ratingNumber: number;
  totalReviews: number;

  totalReading: number;
  totalVideos: number;
  totalQuizzes: number;
  totalExercises: number;

  totalStudents: number;
};
