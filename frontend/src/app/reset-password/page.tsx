import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { ResetPasswordView } from "src/sections/auth/reset-password-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Resetowanie hasła",
  description:
    "Zapomniałeś hasła? Zresetuj je szybko i odzyskaj dostęp do swojego konta na loop, aby kontynuować naukę programowania online.",
  path: paths.resetPassword,
});
export default function Page() {
  return <ResetPasswordView />;
}
