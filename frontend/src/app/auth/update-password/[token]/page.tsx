import { createMetadata } from "src/utils/create-metadata";

import { UpdatePasswordView } from "../../../../sections/auth/update-password-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({ title: "Zmień hasło" });

export default function Page({ params }: { params: { token: string } }) {
  return <UpdatePasswordView token={params.token} />;
}
