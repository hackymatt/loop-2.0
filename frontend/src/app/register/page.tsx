import { createMetadata } from "src/utils/create-metadata";

import { SignUpView } from "src/sections/auth/sign-up-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Dołącz teraz",
  "Rozpocznij naukę IT i zdobądź umiejętności, które pozwolą Ci rozwijać karierę w technologii. Zarejestruj się teraz za darmo w loop!"
);

export default function Page() {
  return <SignUpView />;
}
