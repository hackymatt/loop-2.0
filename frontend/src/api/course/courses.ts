import type { Language } from "src/locales/types";
import type { ICourseProps } from "src/types/course";
import type { QueryType, ListQueryResponse } from "src/api/types";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getListData, formatQueryParams } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

const endpoint = "/courses" as const;

type ICourse = {
  slug: string;
  translated_name: string;
};

export const coursesQuery = (query?: QueryType, language?: Language) => {
  const url = endpoint;
  const urlParams = formatQueryParams(query);
  const queryUrl = urlParams ? `${url}?${urlParams}` : url;

  const queryFn = async (): Promise<ListQueryResponse<ICourseProps[]>> => {
    const { results, records_count, pages_count } = await getListData<ICourse>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    const modifiedResults: ICourseProps[] = (results ?? []).map(
      ({ translated_name, ...rest }: ICourse) => ({
        ...rest,
        name: translated_name,
      })
    );
    return { results: modifiedResults, count: records_count, pagesCount: pages_count };
  };

  return { url, queryFn, queryKey: compact([url, urlParams, language]) };
};

export const useCourses = (query?: QueryType, enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = coursesQuery(query, language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return { data: data?.results, count: data?.count, ...rest };
};
