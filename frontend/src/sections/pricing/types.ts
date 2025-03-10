export type PricingCardProps = {
  license: string;
  popular: boolean;
  premium: boolean;
  icon: string;
  price: number;
  options: {
    title: string;
    tooltip?: string;
    disabled: boolean;
  }[];
};
