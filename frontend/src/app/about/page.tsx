import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { AboutView } from "src/sections/view/about-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "O nas",
  description:
    "loop to nowoczesna szkoła programowania online. Uczymy od podstaw i zaawansowanych technik kodowania. Poznaj naszą misję i dołącz do nas!",
  path: paths.about,
});

export default function Page() {
  return <AboutView />;
}
