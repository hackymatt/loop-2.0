import type { AxiosError } from "axios";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { URLS } from "src/api/urls";
import { Api } from "src/api/service";

import { useSettingsContext } from "src/components/settings";

const endpoint = URLS.REVIEW_SUBMIT;

type ISubmit = {
  slug: string;
  rating: number;
  comment: string | null;
};

type ISubmitReturn = { data: ISubmit; status: number };

export const useReviewSubmit = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  const queryClient = useQueryClient();

  return useMutation<ISubmitReturn, AxiosError, ISubmit>(
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
        queryClient.invalidateQueries([URLS.REVIEWS]);
        queryClient.invalidateQueries([URLS.REVIEWS_SUMMARY]);
        queryClient.invalidateQueries([URLS.COURSES]);
        queryClient.invalidateQueries([URLS.FEATURED_REVIEWS]);
      },
    }
  );
};
