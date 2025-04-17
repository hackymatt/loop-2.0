"use client";

import type { AxiosError } from "axios";
import type { IQuizLessonProps, IVideoLessonProps, IReadingLessonProps } from "src/types/lesson";

import { useTranslation } from "react-i18next";
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
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

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
  const { t } = useTranslation("navigation");
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

  // Loading and error states
  const isLoading = isLoadingCourse || isLoadingLesson;
  const isError = isErrorCourse || isErrorLesson;

  // Flat list of all lessons
  const allLessons = useMemo(
    () => courseData?.chapters.flatMap((ch) => ch.lessons) ?? [],
    [courseData]
  );

  // Current lesson index and info
  const currentLessonIndex = useMemo(
    () => allLessons.findIndex((l) => l.slug === lessonSlug),
    [allLessons, lessonSlug]
  );
  const currentLessonInfo = useMemo(
    () => allLessons[currentLessonIndex],
    [allLessons, currentLessonIndex]
  );

  // Current chapter
  const currentChapter = useMemo(
    () =>
      courseData?.chapters.find((ch) => ch.lessons.some((lesson) => lesson.slug === lessonSlug)),
    [courseData, lessonSlug]
  );

  // Handlers for navigation
  const handleNavigation = (direction: "prev" | "next") => {
    const newIndex = direction === "prev" ? currentLessonIndex - 1 : currentLessonIndex + 1;
    if (newIndex >= 0 && newIndex < allLessons.length) {
      const newLesson = allLessons[newIndex];
      router.push(`${paths.learn}/${courseSlug}/${newLesson.slug}`);
    }
  };

  // Handle lesson submission
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

  // Fallback states
  if (isError) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  // Lesson type
  const lessonType = currentLessonInfo?.type ?? LESSON_TYPE.READING;

  const renderHeader = () => (
    <>
      <CustomBreadcrumbs
        links={[
          { name: t("home"), href: "/" },
          { name: t("courses"), href: paths.eLearning.courses },
          { name: courseData?.name, href: `${paths.course}/${courseSlug}` },
          { name: currentChapter?.name },
        ]}
      />
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
          disablePrev={currentLessonIndex <= 0}
          disableNext={currentLessonIndex >= allLessons.length - 1}
          onClickPrev={() => handleNavigation("prev")}
          onClickNext={() => handleNavigation("next")}
          slotProps={{
            prevBtn: { sx: { left: { xs: 16, md: 24 } } },
            nextBtn: { sx: { right: { xs: 16, md: 24 } } },
          }}
          sx={(theme) => ({
            borderRadius: "50%",
            color: "action.active",
            bgcolor: "transparent",
            ...theme.applyStyles("dark", { color: "action.active" }),
          })}
        />
        <Typography
          variant="h3"
          textAlign="center"
          sx={{ maxWidth: "100%", px: { xs: 4, md: 6 }, wordBreak: "break-word" }}
        >
          {lessonData?.name}
        </Typography>
      </Box>
    </>
  );

  const renderContent = () => {
    switch (lessonType) {
      case LESSON_TYPE.READING:
        return (
          <ReadingLesson
            lesson={lessonData as IReadingLessonProps}
            onSubmit={() => handleSubmit({ answer: "" })}
          />
        );
      case LESSON_TYPE.VIDEO:
        return (
          <VideoLesson
            lesson={lessonData as IVideoLessonProps}
            onSubmit={() => handleSubmit({ answer: "" })}
          />
        );
      case LESSON_TYPE.QUIZ:
        return (
          <QuizLesson
            lesson={lessonData as IQuizLessonProps}
            onSubmit={(answer) => handleSubmit({ answer: answer as boolean[] })}
            onShowAnswer={handleShowAnswer}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="section"
      sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 5, md: 10 }, textAlign: { xs: "center", md: "left" } }}
    >
      <Container>
        {renderHeader()}
        {renderContent()}
      </Container>
    </Box>
  );
}
