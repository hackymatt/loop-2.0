import type { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { URLS } from "src/api/urls";
import { Api } from "src/api/service";

import { useSettingsContext } from "src/components/settings";

const endpoint = URLS.LESSON_HINT;

type IHint = {
  lesson: string;
};

type IHintReturn = { data: { hint: string }; status: number };

export const useLessonHint = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  const queryClient = useQueryClient();

  return useMutation<IHintReturn, AxiosError, IHint>(
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
        queryClient.invalidateQueries([URLS.LESSON]);
        queryClient.invalidateQueries([URLS.COURSES]);
        queryClient.invalidateQueries([URLS.DASHBOARD]);
      },
    }
  );
};
