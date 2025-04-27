import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type {
  IQuizLessonProps,
  IVideoLessonProps,
  ICodingLessonProps,
  IReadingLessonProps,
} from "src/types/lesson";

import { compact } from "lodash-es";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { URLS } from "src/api/urls";
import { getData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

const endpoint = URLS.LESSON;

type IBaseLesson = {
  type: "reading" | "video" | "quiz" | "coding";
  name: string;
  points: number;
};

type IReadingLesson = {
  text: string;
  duration: number;
};

type IVideoLesson = {
  video_url: string;
};

type IQuizLessonQuestionOption = {
  text: string;
};

type IQuizLessonQuestion = {
  text: string;
  options: IQuizLessonQuestionOption[];
};

type IQuizLesson = {
  quiz_type: "single" | "multi";
  question: IQuizLessonQuestion;
  answer?: boolean[];
};

type ICodingLesson = {
  technology: string;
  starter_code: string;
  introduction: string;
  instructions: string;
  penalty_points: number;
  hint?: string;
  answer?: string;
};

type ILesson = IBaseLesson & (IReadingLesson | IVideoLesson | IQuizLesson | ICodingLesson);

export const lessonQuery = (courseSlug: string, lessonSlug: string, language?: Language) => {
  const url = endpoint;
  const queryUrl = `${url}/${courseSlug}/${lessonSlug}`;

  const queryFn = async (): Promise<
    GetQueryResponse<
      IReadingLessonProps | IVideoLessonProps | IQuizLessonProps | ICodingLessonProps
    >
  > => {
    const { data } = await getData<ILesson>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });

    const { type, name, points, ...specificLesson }: ILesson = data;

    if (type === "reading") {
      return {
        results: { type, totalPoints: points, name, ...specificLesson } as IReadingLessonProps,
      };
    }
    if (type === "video") {
      const { video_url } = specificLesson as IVideoLesson;
      return {
        results: { type, totalPoints: points, name, videoUrl: video_url } as IVideoLessonProps,
      };
    }
    if (type === "quiz") {
      const { quiz_type, answer, ...quizRest } = specificLesson as IQuizLesson;
      return {
        results: {
          type,
          name,
          totalPoints: points,
          quizType: quiz_type,
          answer: answer ?? null,
          ...quizRest,
        } as IQuizLessonProps,
      };
    }

    const { penalty_points, starter_code, answer, hint, ...codingRest } =
      specificLesson as ICodingLesson;
    return {
      results: {
        type,
        name,
        totalPoints: points,
        penaltyPoints: penalty_points,
        starterCode: starter_code,
        hint: hint ?? null,
        answer: answer ?? null,
        ...codingRest,
      } as ICodingLessonProps,
    };
  };

  return { url, queryFn, queryKey: compact([url, courseSlug, lessonSlug, language]) };
};

export const useLesson = (courseSlug: string, lessonSlug: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = lessonQuery(courseSlug, lessonSlug, language);
  const { data, ...rest } = useQuery({
    queryKey,
    queryFn,
    enabled,
    onSuccess: () => {
      queryClient.invalidateQueries([URLS.COURSES]);
      queryClient.invalidateQueries([URLS.DASHBOARD]);
    },
  });
  return { data: data?.results, ...rest };
};
