import type { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { URLS } from "src/api/urls";
import { Api } from "src/api/service";

import { useSettingsContext } from "src/components/settings";

const endpoint = URLS.SUBSCRIBE;

type ISubscribe = {
  plan: string;
  interval: "monthly" | "yearly" | null;
  user: { first_name: string; last_name: string };
};

type ISubscribeReturn = {
  data: { type: string; interval: "monthly" | "yearly" | null; valid_to: string | null };
  status: number;
};

export const useSubscribe = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  const queryClient = useQueryClient();

  return useMutation<ISubscribeReturn, AxiosError, ISubscribe>(
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
        queryClient.invalidateQueries([URLS.DASHBOARD]);
      },
    }
  );
};
