import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { Api } from "../service";

const endpoint = "/auth/register" as const;

export type IRegister = {
  email: string;
  password: string;
};

export type IRegisterReturn = Omit<IRegister, "password">;

export const useRegister = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IRegisterReturn, AxiosError, IRegister>(async (variables) => {
    const result = await Api.post(endpoint, variables, {
      headers: {
        "Accept-Language": language,
      },
    });
    return result.data;
  });
};
