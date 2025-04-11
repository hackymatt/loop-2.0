import { createMetadata } from "src/utils/create-metadata";

import { AccountPersonalView } from "src/sections/_account/view/account-personal-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Dane osobowe",
});

export default function Page() {
  return <AccountPersonalView />;
}
