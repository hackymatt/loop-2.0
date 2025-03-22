import { CONFIG } from "src/global-config";

import { SignUpCenteredView } from "src/sections/auth/sign-up-centered-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpCenteredView />;
}
