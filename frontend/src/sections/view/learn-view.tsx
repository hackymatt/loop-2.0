"use client";

import type { AxiosError } from "axios";
import type { IQuizLessonProps, IVideoLessonProps, IReadingLessonProps } from "src/types/lesson";

import React, { useMemo, useState } from "react";

import { Box, Container, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { LESSON_TYPE } from "src/consts/lesson";
import { useCourse } from "src/api/course/course";
import { useLesson } from "src/api/course/lesson/lesson";
import { useLessonSubmit } from "src/api/course/lesson/submit";
import { useLessonAnswer } from "src/api/course/lesson/answer";

import { SplashScreen } from "src/components/loading-screen";

import { QuizLesson } from "../learn/quiz-lesson";
import { VideoLesson } from "../learn/video-lesson";
import { NotFoundView } from "../error/not-found-view";
import { ReadingLesson } from "../learn/reading-lesson";
import { ArrowFloatButtons } from "../learn/arrow-buttons/arrow-buttons";

interface LearnViewProps {
  courseSlug: string;
  lessonSlug: string;
}

export function LearnView({ courseSlug, lessonSlug }: LearnViewProps) {
  const router = useRouter();

  // Fetch course and lesson data
  const {
    data: courseData,
    isLoading: isLoadingCourse,
    isError: isErrorCourse,
  } = useCourse(courseSlug);

  const {
    data: lessonData,
    isLoading: isLoadingLesson,
    isError: isErrorLesson,
  } = useLesson(courseSlug, lessonSlug);

  const { mutateAsync: submit } = useLessonSubmit();
  const { mutateAsync: showAnswer } = useLessonAnswer();

  const [error, setError] = useState<string>();

  const isLoading = isLoadingCourse || isLoadingLesson;
  const isError = isErrorCourse || isErrorLesson;

  // Flat list of all lessons
  const allLessons = useMemo(
    () => courseData?.chapters.flatMap((ch) => ch.lessons) ?? [],
    [courseData]
  );

  // Current lesson index
  const currentLessonIndex = useMemo(
    () => allLessons.findIndex((l) => l.slug === lessonSlug),
    [allLessons, lessonSlug]
  );

  // Current lesson info (used to determine type)
  const currentLessonInfo = useMemo(
    () => allLessons[currentLessonIndex],
    [allLessons, currentLessonIndex]
  );

  // Handlers for prev/next
  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      if (prevLesson?.slug) {
        router.push(`${paths.learn}/${courseSlug}/${prevLesson.slug}`);
      }
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      if (nextLesson?.slug) {
        router.push(`${paths.learn}/${courseSlug}/${nextLesson.slug}`);
      }
    }
  };

  const handleSubmit = async (data: { answer: string | boolean[] }) => {
    setError(undefined);

    const nextLesson = allLessons[currentLessonIndex + 1];
    const nextSlug = nextLesson?.slug;

    try {
      await submit({ ...data, lesson: lessonSlug });
      router.push(
        nextSlug ? `${paths.learn}/${courseSlug}/${nextSlug}` : `${paths.course}/${courseSlug}`
      );
    } catch (err) {
      setError(((err as AxiosError).response?.data as { answer: string })?.answer);
    }
  };

  const handleShowAnswer = async () => {
    try {
      await showAnswer({ lesson: lessonSlug });
    } catch (err) {
      console.log(err);
    }
  };

  // Navigation button states
  const disablePrev = currentLessonIndex <= 0;
  const disableNext = currentLessonIndex >= allLessons.length - 1;

  // Fallback states
  if (isError) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  const lessonType = currentLessonInfo?.type ?? LESSON_TYPE.READING;

  return (
    <Box
      component="section"
      sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 5, md: 10 }, textAlign: { xs: "center", md: "left" } }}
    >
      <Container>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
            px: { xs: 8, md: 10 },
          }}
        >
          <ArrowFloatButtons
            disablePrev={disablePrev}
            disableNext={disableNext}
            onClickPrev={handlePrev}
            onClickNext={handleNext}
            slotProps={{
              prevBtn: { sx: { left: { xs: 16, md: 24 } } },
              nextBtn: { sx: { right: { xs: 16, md: 24 } } },
            }}
          />
          <Typography
            variant="h3"
            textAlign="center"
            sx={{
              maxWidth: "100%",
              px: { xs: 4, md: 6 },
              wordBreak: "break-word",
            }}
          >
            {lessonData?.name}
          </Typography>
        </Box>

        {lessonType === LESSON_TYPE.READING && (
          <ReadingLesson
            lesson={lessonData as IReadingLessonProps}
            onSubmit={() => handleSubmit({ answer: "" })}
          />
        )}

        {lessonType === LESSON_TYPE.VIDEO && (
          <VideoLesson
            lesson={lessonData as IVideoLessonProps}
            onSubmit={() => handleSubmit({ answer: "" })}
          />
        )}

        {lessonType === LESSON_TYPE.QUIZ && (
          <QuizLesson
            lesson={lessonData as IQuizLessonProps}
            onSubmit={(answer) => handleSubmit({ answer: answer as boolean[] })}
            onShowAnswer={handleShowAnswer}
            error={error}
          />
        )}
      </Container>
    </Box>
  );
}
