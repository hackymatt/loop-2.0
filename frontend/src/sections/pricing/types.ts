export type PricingCardProps = {
  license: string;
  popular: boolean;
  premium: boolean;
  icon: string;
  price: string;
  caption?: string;
  options: {
    title: string;
    tootip?: string;
    disabled: boolean;
  }[];
};
