import type { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.LOGOUT;

type ILogout = {};

type ILogoutReturn = {
  data: {};
  status: number;
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<ILogoutReturn, AxiosError, ILogout>(
    async (variables) => {
      const result = await Api.post(endpoint, variables);
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
