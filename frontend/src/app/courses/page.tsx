import { CONFIG } from "src/global-config";

import { CoursesView } from "src/sections/view/courses-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Product list | E-commerce - ${CONFIG.appName}` };

export default function Page() {
  return <CoursesView />;
}
