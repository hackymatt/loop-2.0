import { createMetadata } from "src/utils/create-metadata";

import { AccountSubscriptionView } from "src/sections/_account/view/account-subscription-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Subskrypcja",
});

export default function Page() {
  return <AccountSubscriptionView />;
}
