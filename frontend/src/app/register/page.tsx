import { CONFIG } from "src/global-config";

import { SignUpView } from "src/sections/auth/sign-up-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Sign up | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <SignUpView />;
}
