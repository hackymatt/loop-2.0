"use client";

import type { ReactNode } from "react";
import type { AxiosError } from "axios";
import type { BoxProps } from "@mui/material";
import type {
  IQuizLessonProps,
  IVideoLessonProps,
  ICodingLessonProps,
  IReadingLessonProps,
} from "src/types/lesson";

import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Container } from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { LESSON_TYPE } from "src/consts/lesson";
import { useCourse } from "src/api/course/course";
import { useLesson } from "src/api/course/lesson/lesson";
import { useLessonHint } from "src/api/course/lesson/hint";
import { useLessonSubmit } from "src/api/course/lesson/submit";
import { useLessonAnswer } from "src/api/course/lesson/answer";

import { SplashScreen } from "src/components/loading-screen";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { QuizLesson } from "../learn/quiz-lesson";
import { VideoLesson } from "../learn/video-lesson";
import { CodingLesson } from "../learn/coding-lesson";
import { NotFoundView } from "../error/not-found-view";
import { ReadingLesson } from "../learn/reading-lesson";
import { ArrowBasicButtons } from "../learn/arrow-buttons/arrow-buttons";

interface LearnViewProps {
  courseSlug: string;
  lessonSlug: string;
}

const ContentBox = ({ children, sx }: { children: ReactNode; sx?: BoxProps["sx"] }) => (
  <Box
    component="section"
    sx={[
      {
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        height: "80vh",
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    {children}
  </Box>
);

export function LearnView({ courseSlug, lessonSlug }: LearnViewProps) {
  const { t } = useTranslation("learn");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

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
  const { mutateAsync: showHint } = useLessonHint();

  const [error, setError] = useState<string>();

  const isLoading = isLoadingCourse || isLoadingLesson;
  const isError = isErrorCourse || isErrorLesson;

  const allLessons = courseData?.chapters.flatMap((ch) => ch.lessons) ?? [];
  const currentLessonIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  const currentLessonInfo = allLessons[currentLessonIndex];
  const currentChapter = courseData?.chapters.find((ch) =>
    ch.lessons.some((l) => l.slug === lessonSlug)
  );

  const navigateTo = (index: number) => {
    const next = allLessons[index];
    if (next) {
      router.push(`${paths.learn}/${courseSlug}/${next.slug}`);
    }
  };

  const handleSubmit = async (data: { answer: string | boolean[] }) => {
    setError(undefined);
    try {
      await submit({ ...data, lesson: lessonSlug });
      const next = allLessons[currentLessonIndex + 1];
      router.push(
        next ? `${paths.learn}/${courseSlug}/${next.slug}` : `${paths.course}/${courseSlug}`
      );
    } catch (err) {
      setError(((err as AxiosError).response?.data as { answer: string })?.answer);
    }
  };

  const handleShowAnswer = async () => {
    try {
      await showAnswer({ lesson: lessonSlug });
    } catch {
      enqueueSnackbar(t("errors.answer"), { variant: "error" });
    }
  };

  const handleShowHint = async () => {
    try {
      await showHint({ lesson: lessonSlug });
    } catch {
      enqueueSnackbar(t("errors.hint"), { variant: "error" });
    }
  };

  if (isError) return <NotFoundView />;
  if (isLoading) return <SplashScreen />;

  const lessonType = currentLessonInfo?.type ?? LESSON_TYPE.READING;

  const Header = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
        width: "100%",
      }}
    >
      <CustomBreadcrumbs
        links={[
          { name: courseData?.name, href: `${paths.course}/${courseSlug}` },
          { name: currentChapter?.name },
          { name: lessonData?.name },
        ]}
      />
      <ArrowBasicButtons
        disablePrev={currentLessonIndex <= 0}
        disableNext={currentLessonIndex >= allLessons.length - 1}
        onClickPrev={() => navigateTo(currentLessonIndex - 1)}
        onClickNext={() => navigateTo(currentLessonIndex + 1)}
      />
    </Box>
  );

  const Content = () => {
    switch (lessonType) {
      case LESSON_TYPE.READING:
        return (
          <ContentBox>
            <ReadingLesson
              lesson={lessonData as IReadingLessonProps}
              onSubmit={() => handleSubmit({ answer: "" })}
            />
          </ContentBox>
        );
      case LESSON_TYPE.VIDEO:
        return (
          <ContentBox>
            <VideoLesson
              lesson={lessonData as IVideoLessonProps}
              onSubmit={() => handleSubmit({ answer: "" })}
            />
          </ContentBox>
        );
      case LESSON_TYPE.QUIZ:
        return (
          <ContentBox>
            <QuizLesson
              lesson={lessonData as IQuizLessonProps}
              onSubmit={(answer) => handleSubmit({ answer: answer as boolean[] })}
              onShowAnswer={handleShowAnswer}
              error={error}
            />
          </ContentBox>
        );
      case LESSON_TYPE.CODING:
        return (
          <ContentBox sx={{ borderRadius: 0, px: { xs: 0, md: 0 }, py: { xs: 0, md: 0 } }}>
            <CodingLesson
              lesson={lessonData as ICodingLessonProps}
              onRunCode={(answer) => {}}
              onSubmit={(answer) => handleSubmit({ answer: answer as string })}
              onHint={handleShowHint}
              onShowAnswer={handleShowAnswer}
              error={error}
            />
          </ContentBox>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="section"
      sx={{ pb: { xs: 5, md: 10 }, textAlign: { xs: "center", md: "left" } }}
    >
      <Container maxWidth={false}>
        <Header />
        <Content />
      </Container>
    </Box>
  );
}
