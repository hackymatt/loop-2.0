import type { AxiosError, AxiosRequestConfig } from "axios";

import { Api } from "./service";

import type { QueryType, GetApiResponse, ListApiResponse } from "./types";

export async function getListData<T>(queryUrl: string, config?: AxiosRequestConfig<any>) {
  let data: ListApiResponse<T> = { results: [], records_count: 0, pages_count: 0 };

  try {
    const response = await Api.get<ListApiResponse<T>>(queryUrl, config);
    ({ data } = response);
  } catch (error) {
    if (
      (error as AxiosError).response &&
      ((error as AxiosError).response?.status === 400 ||
        (error as AxiosError).response?.status === 404)
    ) {
      data = { results: [], records_count: 0, pages_count: 0 };
    }
  }
  return data;
}

export async function getData<T>(
  queryUrl: string,
  config?: AxiosRequestConfig<any>
): Promise<GetApiResponse<T>> {
  let data: GetApiResponse<T> = { data: {} as T };

  try {
    const response = await Api.get<T>(queryUrl, config);
    data = { data: response.data };
  } catch (error) {
    if (
      (error as AxiosError).response &&
      ((error as AxiosError).response?.status === 400 ||
        (error as AxiosError).response?.status === 404)
    ) {
      data = { data: {} as T };
    }
  }
  return data;
}

export const formatQueryParams = (query?: QueryType): string => {
  if (!query) return "";

  const params = new URLSearchParams(query);
  return params.toString();
};
