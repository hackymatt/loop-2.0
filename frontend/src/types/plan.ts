import type { PLAN_TYPE } from "src/consts/plan";

// ----------------------------------------------------------------------

export type PlanType = (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];

export type PlanPriceProp = {
  monthly: number;
  yearly: number;
};

export type PlanProps = {
  slug: string;
  license: string;
  popular: boolean;
  premium: boolean;
  price: PlanPriceProp;
  options: {
    title: string;
    disabled: boolean;
  }[];
};
