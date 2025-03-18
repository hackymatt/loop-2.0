import { createMetadata } from "src/utils/create-metadata";

import { HomeView } from "src/sections/_home/view/home-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({});

export default function Page() {
  return <HomeView />;
}
