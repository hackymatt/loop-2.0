import { CONFIG } from "src/global-config";

import { AccountWishlistView } from "src/sections/_account/view/account-wishlist-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Wishlist | Account - ${CONFIG.appName}` };

export default function Page() {
  return <AccountWishlistView />;
}
