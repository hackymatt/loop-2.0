import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { ContactView } from "src/sections/view/contact-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Kontakt",
  description:
    "Masz pytania dotyczące kursów programowania? Skontaktuj się z nami! loop to nowoczesna szkoła programowania online. Napisz do nas, a chętnie pomożemy!",
  path: paths.contact,
});

export default function Page() {
  return <ContactView />;
}
