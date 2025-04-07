import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { IBlogRecentProps } from "src/types/blog";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getSimpleListData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";

const endpoint = URLS.RECENT_POSTS;

type ITopic = {
  slug: string;
  translated_name: string;
};

type IBlog = {
  slug: string;
  translated_name: string;
  topic: ITopic;
  image: string;
  published_at: string;
  duration: number;
};

export const recentPostsQuery = (language?: Language) => {
  const url = endpoint;
  const queryUrl = url;

  const queryFn = async (): Promise<GetQueryResponse<IBlogRecentProps[]>> => {
    const results = await getSimpleListData<IBlog>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    const modifiedResults: IBlogRecentProps[] = (results ?? []).map(
      ({ translated_name, topic, image, published_at, ...rest }: IBlog) => ({
        ...rest,
        name: translated_name,
        category: {
          slug: topic.slug,
          name: topic.translated_name,
        },
        heroUrl: image,
        publishedAt: published_at,
      })
    );
    return { results: modifiedResults };
  };

  return { url, queryFn, queryKey: compact([url, language]) };
};

export const useRecentPosts = (enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = recentPostsQuery(language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    ...rest,
  };
};
