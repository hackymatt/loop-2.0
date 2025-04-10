import { createMetadata } from "src/utils/create-metadata";

import { DashboardView } from "src/sections/view/dashboard-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Dashboard",
});

export default function Page() {
  return <DashboardView />;
}
