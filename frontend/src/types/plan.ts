import type { PLAN_TYPE } from "src/consts/plan";

// ----------------------------------------------------------------------

export type PlanType = (typeof PLAN_TYPE)[keyof typeof PLAN_TYPE];

export type IPlanPriceProp = {
  monthly: number;
  yearly: number;
};

type IPlanOptionProp = {
  title: string;
  disabled: boolean;
};

export type IPlanProps = {
  slug: PlanType;
  license: string;
  popular: boolean;
  premium: boolean;
  price: IPlanPriceProp;
  options: IPlanOptionProp[];
};
