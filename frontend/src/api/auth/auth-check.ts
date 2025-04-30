import { compact } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { URLS } from "../urls";
import { getData } from "../utils";

import type { GetQueryResponse } from "../types";

const endpoint = URLS.AUTH_CHECK;

type IAuthCheck = {
  authenticated: boolean;
};

export const authCheckQuery = () => {
  const url = endpoint;
  const queryUrl = url;

  const queryFn = async (): Promise<GetQueryResponse> => {
    const { data } = await getData<IAuthCheck>(queryUrl);

    const { authenticated } = data;

    const modifiedResult = {
      isLoggedIn: authenticated,
    };
    return { results: modifiedResult };
  };

  return { url, queryFn, queryKey: compact([url]) };
};

export const useAuthCheck = (enabled: boolean = true) => {
  const { queryKey, queryFn } = authCheckQuery();
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return { data: data?.results, ...rest };
};
