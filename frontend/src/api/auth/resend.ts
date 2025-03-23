import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { Api } from "../service";

const endpoint = "/auth/resend" as const;

type IResend = {
  token?: string;
  email?: string;
};

type IResendReturn = { data: { email: string }; status: number };

export const useResend = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IResendReturn, AxiosError, IResend>(async (variables) => {
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
