import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { Api } from "../service";

const endpoint = "/auth/activate" as const;

type IActivate = {
  token: string;
};

type IActivateReturn = { email: string };

export const useActivate = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IActivateReturn, AxiosError, IActivate>(async (variables) => {
    const result = await Api.post(endpoint, variables, {
      headers: {
        "Accept-Language": language,
      },
    });
    return result.data;
  });
};
