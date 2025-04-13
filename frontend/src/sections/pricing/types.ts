import type { PlanProps } from "src/types/plan";

export type PricingCardProps = Omit<PlanProps, "price"> & {
  icon: string;
  price: number;
};
