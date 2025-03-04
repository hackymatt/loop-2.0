import { CONFIG } from "src/global-config";

import { AccountVouchersView } from "src/sections/_account/view/account-vouchers-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Vouchers | Account - ${CONFIG.appName}` };

export default function Page() {
  return <AccountVouchersView />;
}
