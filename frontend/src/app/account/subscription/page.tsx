import { CONFIG } from "src/global-config";

import { AccountSubscriptionView } from "src/sections/_account/view/account-subscription-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Payment | Account - ${CONFIG.appName}` };

export default function Page() {
  return <AccountSubscriptionView />;
}
