import { createMetadata } from "src/utils/create-metadata";

import { SignInView } from "src/sections/auth/sign-in-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Logowanie",
  "Zaloguj się do swojego konta na loop i kontynuuj naukę programowania online. Zyskaj dostęp do kursów, materiałów i swoich lekcji."
);

export default function Page() {
  return <SignInView />;
}
