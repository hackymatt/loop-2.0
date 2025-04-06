import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.LOGIN_GITHUB;

type ILogin = {
  code: string;
};

type ILoginReturn = {
  data: { email: string; refresh_token: string; access_token: string };
  status: number;
};

export const useLoginGithub = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<ILoginReturn, AxiosError, ILogin>(async (variables) => {
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
