import { createMetadata } from "src/utils/create-metadata";

import { AboutView } from "src/sections/view/about-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "O nas",
  "loop to nowoczesna szkoła programowania online. Uczymy od podstaw i zaawansowanych technik kodowania. Poznaj naszą misję i dołącz do nas!"
);

export default function Page() {
  return <AboutView />;
}
