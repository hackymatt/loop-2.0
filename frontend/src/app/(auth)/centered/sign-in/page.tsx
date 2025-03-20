import { CONFIG } from "src/global-config";

import { SignInCenteredView } from "src/sections/auth/sign-in-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <SignInCenteredView />;
}
