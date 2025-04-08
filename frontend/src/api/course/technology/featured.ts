import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { ICourseTechnologyProp } from "src/types/course";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { URLS } from "src/api/urls";
import { getSimpleListData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

const endpoint = URLS.FEATURED_TECHNOLOGIES;

type ICourseTechnology = {
  slug: string;
  name: string;
};

export const featuredTechnologiesQuery = (language?: Language) => {
  const url = endpoint;
  const queryUrl = url;

  const queryFn = async (): Promise<GetQueryResponse<ICourseTechnologyProp[]>> => {
    const results = await getSimpleListData<ICourseTechnology>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    return { results };
  };

  return { url, queryFn, queryKey: compact([url, language]) };
};

export const useFeaturedTechnologies = (enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = featuredTechnologiesQuery(language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    ...rest,
  };
};
