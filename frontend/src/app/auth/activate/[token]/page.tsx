import { createMetadata } from "src/utils/create-metadata";

import { ActivateView } from "src/sections/auth/activate-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({ title: "Aktywuj konto" });

export default function Page({ params }: { params: { token: string } }) {
  return <ActivateView token={params.token} />;
}
