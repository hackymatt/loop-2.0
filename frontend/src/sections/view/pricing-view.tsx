"use client";

import { _faqs } from "src/_mock";

import { Faqs } from "../faqs";
import { PricingCardsView } from "../pricing/pricing-cards-view";
import { PricingColumnsView } from "../pricing/pricing-columns-view";

// ----------------------------------------------------------------------

export function PricingView() {
  return (
    <>
      <PricingCardsView />

      <PricingColumnsView />

      <Faqs data={_faqs} />
    </>
  );
}
