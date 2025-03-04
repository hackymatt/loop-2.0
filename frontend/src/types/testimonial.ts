import type { DatePickerFormat } from "src/utils/format-time";

// ----------------------------------------------------------------------

export type ITestimonialProps = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
  ratingNumber: number;
  createdAt: DatePickerFormat;
};
