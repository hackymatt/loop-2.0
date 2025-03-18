import { createMetadata } from "src/utils/create-metadata";

import { CoursesView } from "src/sections/view/courses-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Kursy programowania",
  "Zdobądź praktyczne umiejętności programowania dzięki naszym kursom online. Wybierz kurs, który pomoże Ci rozwinąć karierę w IT. Sprawdź naszą ofertę!"
);
export default function Page() {
  return <CoursesView />;
}
