import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { Api } from "../service";

const endpoint = "/auth/reset-password-confirm" as const;

type IPasswordUpdate = {
  token: string;
  password: string;
};

type IPasswordUpdateReturn = { data: { email: string }; status: number };

export const usePasswordUpdate = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IPasswordUpdateReturn, AxiosError, IPasswordUpdate>(async (variables) => {
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
