import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { IBlogFeaturedPost } from "src/types/blog";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";

const endpoint = URLS.FEATURED_POST;

type ITopic = {
  slug: string;
  translated_name: string;
};

type IAuthor = {
  full_name: string;
  image: string | null;
  role: string;
};

type IBlog = {
  slug: string;
  translated_name: string;
  translated_description: string;
  topic: ITopic;
  author: IAuthor;
  image: string;
  published_at: string;
  duration: number;
};

export const featuredPostQuery = (language?: Language) => {
  const url = endpoint;
  const queryUrl = url;

  const queryFn = async (): Promise<GetQueryResponse<IBlogFeaturedPost>> => {
    const { data } = await getData<IBlog>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });

    const { translated_name, translated_description, topic, author, image, published_at, ...rest } =
      data;
    const modifiedResult: IBlogFeaturedPost = {
      ...rest,
      name: translated_name,
      description: translated_description,
      category: {
        slug: topic.slug,
        name: topic.translated_name,
      },
      author: { ...author, name: author.full_name, avatarUrl: author.image },
      heroUrl: image,
      publishedAt: published_at,
    };
    return { results: modifiedResult };
  };

  return { url, queryFn, queryKey: compact([url, language]) };
};

export const useFeaturedPost = (enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = featuredPostQuery(language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return {
    data: data?.results,
    ...rest,
  };
};
