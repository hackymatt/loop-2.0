import { createMetadata } from "src/utils/create-metadata";

import { AccountManageView } from "src/sections/_account/view/account-manage-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Zarządzaj kontem",
});

export default function Page() {
  return <AccountManageView />;
}
