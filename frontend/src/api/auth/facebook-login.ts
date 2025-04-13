import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.LOGIN_FACEBOOK;

type ILogin = {
  access_token: string;
};

type ILoginReturn = {
  data: {
    email: string;
    first_name: string;
    last_name: string;
    user_type: "admin" | "instructor" | "student";
    is_active: boolean;
    plan: "free" | "basic" | "premium";
  };
  status: number;
};

export const useLoginFacebook = () => {
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
