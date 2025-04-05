import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { ICourseListProps } from "src/types/course";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getSimpleListData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

const endpoint = "/similar-courses" as const;

type ILevel = {
  slug: string;
  translated_name: string;
};

type ICategory = {
  slug: string;
  translated_name: string;
};

type ITechnology = {
  slug: string;
  name: string;
};

type IInstructor = {
  full_name: string;
  image: string | null;
  role: string;
};

type ICourse = {
  slug: string;
  translated_name: string;
  translated_description: string;
  level: ILevel;
  category: ICategory;
  technology: ITechnology;
  instructors: IInstructor[];
  duration: number;
  lessons_count: number;
  average_rating: number | null;
  ratings_count: number;
  students_count: number;
};

export const similarCoursesQuery = (slug: string, language?: Language) => {
  const url = endpoint;
  const queryUrl = `${url}/${slug}`;

  const queryFn = async (): Promise<GetQueryResponse<ICourseListProps[]>> => {
    const results = await getSimpleListData<ICourse>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    const modifiedResults: ICourseListProps[] = (results ?? []).map(
      ({
        translated_name,
        translated_description,
        level,
        category,
        technology,
        instructors,
        duration,
        lessons_count,
        average_rating,
        ratings_count,
        students_count,
        ...rest
      }: ICourse) => ({
        ...rest,
        name: translated_name,
        description: translated_description,
        level: {
          slug: level.slug,
          name: level.translated_name,
        },
        category: {
          slug: category.slug,
          name: category.translated_name,
        },
        technology: {
          slug: technology.slug,
          name: technology.name,
        },
        teachers: instructors.map(({ full_name, image, ...restInstructor }) => ({
          ...restInstructor,
          name: full_name,
          avatarUrl: image,
        })),
        totalHours: duration / 60,
        totalLessons: lessons_count,
        ratingNumber: average_rating,
        totalReviews: ratings_count,
        totalStudents: students_count,
      })
    );
    return { results: modifiedResults };
  };

  return { url, queryFn, queryKey: compact([url, slug, language]) };
};

export const useSimilarCourses = (slug: string, enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = similarCoursesQuery(slug, language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    ...rest,
  };
};
