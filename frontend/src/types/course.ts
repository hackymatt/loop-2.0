import type { COURSE_TYPE } from "src/consts/course";

import type { IInstructorProps } from "./user";

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

export type ICourseStatusProp = {
  slug: string;
  name: string;
};

export type ICourseTeacherProp = IInstructorProps;

export type ICourseLessonType = (typeof COURSE_TYPE)[keyof typeof COURSE_TYPE];

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

type ICourseBaseProps = {
  slug: string;
  name: string;
  description: string;
  level: ICourseLevelProp;
  category: ICourseCategoryProp;
  technology: ICourseTechnologyProp;
  teachers: ICourseTeacherProp[];
  totalHours: number;
  // calculated
  totalLessons: number;
  ratingNumber: number | null;
  totalReviews: number;
  totalStudents: number;
  progress: number | null;
};

export type ICourseListProps = ICourseBaseProps;

export type ICourseProps = ICourseBaseProps & {
  overview: string;
  chapters: ICourseChapterProp[];
  totalPoints: number;
  totalReading: number;
  totalVideos: number;
  totalQuizzes: number;
  totalExercises: number;
  chatUrl: string | null;
};
