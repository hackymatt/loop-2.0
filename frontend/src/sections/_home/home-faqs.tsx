import type { Variants } from "framer-motion";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

import { varFade } from "src/components/animate";

import { Faqs } from "../faqs";

// ----------------------------------------------------------------------

const variants: Variants = varFade("inUp", { distance: 24 });

type IFaqProps = {
  id: string;
  title: string;
  icon: string;
  content: { question: string; answer: string }[];
};

export function HomeFAQs({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("faq");
  const faq = t("faq", { returnObjects: true }) as IFaqProps[];
  const payments = faq.filter((f) => f.id === "payments")[0].content;
  return (
    <m.div variants={variants}>
      <Faqs data={payments} sx={sx} {...other} />
    </m.div>
  );
}
