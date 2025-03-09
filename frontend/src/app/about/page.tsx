import { CONFIG } from "src/global-config";

import { AboutView } from "src/sections/view/about-view";

// ----------------------------------------------------------------------

export const metadata = { title: `About us | E-learning - ${CONFIG.appName}` };

export default function Page() {
  return <AboutView />;
}
