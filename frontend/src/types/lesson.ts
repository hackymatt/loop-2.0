import type { QUIZ_TYPE } from "src/consts/lesson";

import type { ICourseLessonType } from "./course";

// ----------------------------------------------------------------------

type ILessonBaseProps = {
  type: ICourseLessonType;
  name: string;
  totalPoints: number;
};

export type IReadingLessonProps = ILessonBaseProps & { text: string };

export type IVideoLessonProps = ILessonBaseProps & { videoUrl: string };

type IQuizType = (typeof QUIZ_TYPE)[keyof typeof QUIZ_TYPE];
type IQuizQuestionOptionProp = { text: string };
type IQuizQuestionProp = { text: string; options: IQuizQuestionOptionProp[] };
export type IQuizLessonProps = ILessonBaseProps & {
  quizType: IQuizType;
  question: IQuizQuestionProp;
  answer: boolean[] | null;
};

export type ICodingLessonProps = ILessonBaseProps & {
  technology: string;
  introduction: string;
  instructions: string;
  penaltyPoints: number;
  starterCode: string;
};
