import type { DatePickerFormat } from "src/utils/format-time";

// ----------------------------------------------------------------------

export type IReviewSummaryProps = {
  rating: number;
  count: number;
};

type IReviewUser = {
  name: string;
  avatarUrl: string | null;
};

export type IReviewItemProp = {
  rating: number;
  message: string | null;
  student: IReviewUser;
  createdAt: DatePickerFormat;
};
