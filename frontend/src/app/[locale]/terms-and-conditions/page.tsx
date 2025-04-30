import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { TermsAndConditionsView } from "src/sections/view/terms-and-conditions-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Regulamin",
  description:
    "Zapoznaj się z regulaminem korzystania z platformy loop. Sprawdź zasady dotyczące uczestnictwa w kursach, płatności, rejestracji i ochrony danych osobowych.",
  path: paths.termsAndConditions,
});
export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}
