import type { Language } from "src/locales/types";

import { compact } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { getData } from "../utils";

import type { GetQueryResponse } from "../types";

const endpoint = URLS.AUTH_CHECK;

type IAuthCheck = {
  authenticated: boolean;
};

export const authCheckQuery = (language?: Language) => {
  const url = endpoint;
  const queryUrl = url;

  const queryFn = async (): Promise<GetQueryResponse> => {
    const { data } = await getData<IAuthCheck>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });

    const { authenticated } = data;

    const modifiedResult = {
      isLoggedIn: authenticated,
    };
    return { results: modifiedResult };
  };

  return { url, queryFn, queryKey: compact([url, language]) };
};

export const useAuthCheck = (enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = authCheckQuery(language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return { data: data?.results, ...rest };
};
