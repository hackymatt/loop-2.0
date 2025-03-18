import { createMetadata } from "src/utils/create-metadata";

import { ContactView } from "src/sections/view/contact-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Kontakt",
  "Masz pytania dotyczące kursów programowania? Skontaktuj się z nami! loop to nowoczesna szkoła programowania online. Napisz do nas, a chętnie pomożemy!"
);

export default function Page() {
  return <ContactView />;
}
