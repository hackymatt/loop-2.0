import type { AxiosError } from "axios";

import { useMutation } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";
import { Api } from "../service";

const endpoint = URLS.DELETE_ACCOUNT;

type IDeleteAccount = {};

type IDeleteAccountReturn = {
  data: IDeleteAccount;
  status: number;
};

export const useDeleteAccount = () => {
  const settings = useSettingsContext();
  const { language } = settings.state;

  return useMutation<IDeleteAccountReturn, AxiosError, IDeleteAccount>(async () => {
    const result = await Api.delete(endpoint, {
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
