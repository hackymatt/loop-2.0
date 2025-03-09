"use client";

import { _testimonials } from "src/_mock";

import { Testimonial } from "../testimonial";
import { PricingFaqs } from "../pricing/pricing-faqs";
import { PricingCardsView } from "../pricing/pricing-cards-view";
import { PricingColumnsView } from "../pricing/pricing-columns-view";

// ----------------------------------------------------------------------

export function PricingView() {
  return (
    <>
      <PricingCardsView />

      <PricingColumnsView />

      <Testimonial testimonials={_testimonials} />

      <PricingFaqs />
    </>
  );
}
