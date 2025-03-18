import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { PrivacyPolicyView } from "src/sections/view/privacy-policy-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Polityka prywatności",
  description:
    "Dowiedz się, jak loop chroni Twoje dane osobowe. Przeczytaj naszą politykę prywatności, aby poznać szczegóły dotyczące przetwarzania i zabezpieczania Twoich informacji.",
  path: paths.privacyPolicy,
});
export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
