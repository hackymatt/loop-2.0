import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.ACTIVATE;

type IActivate = {
  token: string;
};

type IActivateReturn = { data: { email: string }; status: number };

export const useActivate = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IActivateReturn, AxiosError, IActivate>(async (variables) => {
    const result = await Api.post(endpoint, variables, {
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
