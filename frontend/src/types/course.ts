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
  name: string;
  role: string;
  avatarUrl: string | null;
};

export type ICourseLessonType = "reading" | "video" | "quiz" | "coding";

export type ICourseLessonProp = {
  slug: string;
  name: string;
  type: ICourseLessonType;
  totalPoints: number;
};

export type ICourseChapterProp = {
  slug: string;
  name: string;
  description: string;
  lessons: ICourseLessonProp[];
};

export type ICourseProps = {
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
  totalReading: number;
  totalVideos: number;
  totalQuizzes: number;
  totalExercises: number;
  ratingNumber: number | null;
  totalReviews: number;

  totalStudents: number;
};

export type ICourseListProps = Omit<
  ICourseProps,
  | "overview"
  | "chapters"
  | "chatUrl"
  | "totalPoints"
  | "totalReading"
  | "totalVideos"
  | "totalQuizzes"
  | "totalExercises"
> & { totalLessons: number };
