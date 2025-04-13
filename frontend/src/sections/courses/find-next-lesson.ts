import type { ICourseLessonProp, ICourseChapterProp } from "src/types/course";

export function findNextLesson(chapters: ICourseChapterProp[]): ICourseLessonProp | null {
  const chapterWithNextLesson = chapters.find((chapter) =>
    chapter.lessons.some((lesson) => lesson.progress === 0)
  );

  return chapterWithNextLesson?.lessons.find((lesson) => lesson.progress === 0) || null;
}
