import type { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.LOGOUT;

type ILogout = {};

type ILogoutReturn = {
  data: {};
  status: number;
};

export const useLogout = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const queryClient = useQueryClient();

  return useMutation<ILogoutReturn, AxiosError, ILogout>(
    async (variables) => {
      const result = await Api.post(endpoint, variables, {
        headers: {
          "Accept-Language": language,
        },
      });
      return {
        status: result.status,
        data: result.data,
      };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([URLS.AUTH_CHECK]);
      },
    }
  );
};
