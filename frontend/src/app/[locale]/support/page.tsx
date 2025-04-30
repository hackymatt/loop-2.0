import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { SupportView } from "src/sections/view/support-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Pomoc",
  description:
    "Potrzebujesz wsparcia? Skontaktuj się z działem pomocy loop. Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące kursów programowania, logowania i rejestracji.",
  path: paths.support,
});

export default function Page() {
  return <SupportView />;
}
