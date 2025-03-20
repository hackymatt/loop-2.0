"use client";

import { useTranslation } from "react-i18next";

import { Faqs } from "../faqs";
import { PricingCardsView } from "../pricing/pricing-cards-view";
import { PricingColumnsView } from "../pricing/pricing-columns-view";

// ----------------------------------------------------------------------
type IFaqProps = { question: string; answer: string };

export function PricingView() {
  const { t } = useTranslation("faq");
  const faq = t("pricing", { returnObjects: true }) as IFaqProps[];
  return (
    <>
      <PricingCardsView />

      <PricingColumnsView />

      <Faqs data={faq} />
    </>
  );
}
