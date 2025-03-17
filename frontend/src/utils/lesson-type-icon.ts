import type { ICourseLessonType } from "src/types/course";

const VIDEO_ICON = "carbon:video";
const ARTICLE_ICON = "carbon:book";
const QUIZ_ICON = "carbon:question-answering";
const EXERCISE_ICON = "carbon:code";

const LESSON_TYPE_ICONS = new Map<string, string>([
  ["video", VIDEO_ICON],
  ["article", ARTICLE_ICON],
  ["quiz", QUIZ_ICON],
  ["exercise", EXERCISE_ICON],
]);

export function getLessonTypeIcon(type: ICourseLessonType): string {
  return LESSON_TYPE_ICONS.get(type) ?? EXERCISE_ICON;
}
