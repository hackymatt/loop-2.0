import type { ICourseLessonProp } from "src/types/course";

import { useState, useCallback } from "react";
import { useBoolean } from "minimal-shared/hooks";

import Typography from "@mui/material/Typography";

import { CourseDetailsLessonItem } from "./course-details-lesson-item";
import { CourseDetailsLessonsDialog } from "./course-details-lessons-dialog";

// ----------------------------------------------------------------------

type Props = {
  lessons: ICourseLessonProp[];
};

export function CourseDetailsLessonList({ lessons }: Props) {
  const videoPlay = useBoolean();

  const [expanded, setExpanded] = useState<string | false>(false);

  const [selectedLesson, setSelectedLesson] = useState<ICourseLessonProp | null>(null);

  const handleReady = useCallback(() => {
    setTimeout(() => videoPlay.onTrue(), 500);
  }, [videoPlay]);

  const handleSelectedLesson = useCallback((lesson: ICourseLessonProp) => {
    if (lesson.unLocked) {
      setSelectedLesson(lesson);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedLesson(null);
    videoPlay.onFalse();
  }, [videoPlay]);

  const handleExpandedLesson = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Lessons
      </Typography>

      {lessons.map((lesson) => (
        <CourseDetailsLessonItem
          key={lesson.id}
          lesson={lesson}
          expanded={expanded === lesson.id}
          onExpanded={handleExpandedLesson(lesson.id)}
          selected={selectedLesson?.id === lesson.id}
          onSelected={() => {
            handleSelectedLesson(lesson);
          }}
        />
      ))}

      <CourseDetailsLessonsDialog
        lessons={lessons}
        selectedLesson={selectedLesson}
        onSelectedLesson={(lesson) => setSelectedLesson(lesson)}
        open={!!selectedLesson?.unLocked}
        onClose={handleClose}
        playing={videoPlay.value}
        onReady={handleReady}
        onEnded={videoPlay.onFalse}
        onPlay={videoPlay.onTrue}
        onPause={videoPlay.onFalse}
      />
    </div>
  );
}
