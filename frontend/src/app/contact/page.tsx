import { CONFIG } from "src/global-config";

import { ContactView } from "src/sections/view/contact-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Contact us | Career - ${CONFIG.appName}` };

export default function Page() {
  return <ContactView />;
}
