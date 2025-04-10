import { CONFIG } from "src/global-config";

import { AccountManageView } from "src/sections/_account/view/account-manage-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Wishlist | Account - ${CONFIG.appName}` };

export default function Page() {
  return <AccountManageView />;
}
