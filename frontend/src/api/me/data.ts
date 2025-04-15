import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.DATA;

type IData = { first_name?: string | null; last_name?: string | null; image?: File | null };

type IDataReturn = {
  data: Omit<IData, "image"> & { image: string | null };
  status: number;
};

export const useUpdateData = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IDataReturn, AxiosError, IData>(async (variables) => {
    const result = await Api.patch(endpoint, variables, {
      headers: {
        "Accept-Language": language,
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      status: result.status,
      data: result.data,
    };
  });
};
