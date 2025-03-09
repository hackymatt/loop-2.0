import { CONFIG } from "src/global-config";

import { PricingView } from "src/sections/view/pricing-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Pricing cards - ${CONFIG.appName}` };

export default function Page() {
  return <PricingView />;
}
