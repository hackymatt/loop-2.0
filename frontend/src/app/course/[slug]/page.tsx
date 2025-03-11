import { CONFIG } from "src/global-config";

import { CourseView } from "src/sections/view/course-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Product list | E-commerce - ${CONFIG.appName}` };

export default function Page() {
  return <CourseView />;
}
