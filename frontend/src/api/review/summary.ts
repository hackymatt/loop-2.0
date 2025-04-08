import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { IReviewSummaryProps } from "src/types/review";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getSimpleListData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";

const endpoint = URLS.REVIEWS_SUMMARY;

type IReviewSummary = {
  rating: number;
  count: number;
};

export const reviewsSummaryQuery = (slug: string, language?: Language) => {
  const url = endpoint;
  const queryUrl = `${url}/${slug}`;

  const queryFn = async (): Promise<GetQueryResponse<IReviewSummaryProps[]>> => {
    const results = await getSimpleListData<IReviewSummary>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    return { results };
  };

  return { url, queryFn, queryKey: compact([url, slug, language]) };
};

export const useReviewsSummary = (slug: string, enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = reviewsSummaryQuery(slug, language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    ...rest,
  };
};
