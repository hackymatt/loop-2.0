import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { CoursesView } from "src/sections/view/courses-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Kursy programowania",
  description:
    "Zdobądź praktyczne umiejętności programowania dzięki naszym kursom online. Wybierz kurs, który pomoże Ci rozwinąć karierę w IT. Sprawdź naszą ofertę!",
  path: paths.courses,
});
export default function Page() {
  return <CoursesView />;
}
