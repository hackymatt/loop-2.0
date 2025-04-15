import type { Language } from "src/locales/types";
import type { GetQueryResponse } from "src/api/types";
import type { ICertificateProps } from "src/types/certificate";

import { compact } from "lodash-es";
import { useQuery } from "@tanstack/react-query";

import { getData } from "src/api/utils";

import { useSettingsContext } from "src/components/settings";

import { URLS } from "../urls";

const endpoint = URLS.CERTIFICATES;

type ICertificate = {
  id: string;
  student_name: string;
  course_name: string;
  completed_at: string;
};

export const certificateQuery = (id: string, language?: Language) => {
  const url = endpoint;
  const queryUrl = `${url}/${id}`;

  const queryFn = async (): Promise<GetQueryResponse<ICertificateProps>> => {
    const { data } = await getData<ICertificate>(queryUrl, {
      headers: {
        "Accept-Language": language,
      },
    });
    const { student_name, course_name, completed_at, ...rest }: ICertificate = data;

    const modifiedResult: ICertificateProps = {
      ...rest,
      studentName: student_name,
      courseName: course_name,
      completedAt: completed_at,
    };
    return { results: modifiedResult };
  };

  return { url, queryFn, queryKey: compact([url, id, language]) };
};

export const useCertificate = (id: string, enabled: boolean = true) => {
  const settings = useSettingsContext();
  const { language } = settings.state;
  const { queryKey, queryFn } = certificateQuery(id, language);
  const { data, ...rest } = useQuery({ queryKey, queryFn, enabled });
  return { data: data?.results, ...rest };
};
