import type { Language } from "src/locales/types";
import type { ListQueryResponse } from "src/api/types";
import type { IReviewItemProp } from "src/types/review";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getListData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";

const endpoint = URLS.REVIEWS;

type IStudent = {
  first_name: string;
  image: string | null;
};

type IReview = {
  student: IStudent;
  rating: number;
  comment: string;
  created_at: string;
};

export const reviewsQuery = (slug: string, language?: Language) => {
  const url = endpoint;
  const queryUrl = `${url}/${slug}`;

  const queryFn = async (): Promise<ListQueryResponse<IReviewItemProp[]>> => {
    const { results, records_count, pages_count } = await getListData<IReview>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    const modifiedResults: IReviewItemProp[] = (results ?? []).map(
      ({ student, comment, created_at, ...rest }: IReview) => ({
        ...rest,
        student: {
          name: student.first_name,
          avatarUrl: student.image,
        },
        message: comment,
        createdAt: created_at,
      })
    );
    return { results: modifiedResults, count: records_count, pagesCount: pages_count };
  };

  return { url, queryFn, queryKey: compact([url, slug, language]) };
};

export const useReviews = (slug: string, enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = reviewsQuery(slug, language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    count: data?.count,
    pageSize: data?.pagesCount,
    ...rest,
  };
};
