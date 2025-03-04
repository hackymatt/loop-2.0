import { CONFIG } from "src/global-config";

import { PricingColumnsView } from "src/sections/pricing/view/pricing-columns-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Pricing columns - ${CONFIG.appName}` };

export default function Page() {
  return <PricingColumnsView />;
}
