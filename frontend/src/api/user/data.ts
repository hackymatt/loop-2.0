import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.DATA;

type IData = { first_name: string | null; last_name: string | null };

type IDataReturn = {
  data: IData;
  status: number;
};

export const useUpdateData = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IDataReturn, AxiosError, IData>(async (variables) => {
    const result = await Api.patch(endpoint, variables, {
      headers: {
        "Accept-Language": language,
      },
    });
    return {
      status: result.status,
      data: result.data,
    };
  });
};
