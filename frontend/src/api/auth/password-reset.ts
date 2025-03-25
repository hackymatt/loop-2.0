import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { Api } from "../service";

const endpoint = "/auth/reset-password" as const;

type IPasswordReset = {
  email: string;
};

type IPasswordResetReturn = { data: IPasswordReset; status: number };

export const usePasswordReset = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IPasswordResetReturn, AxiosError, IPasswordReset>(async (variables) => {
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
