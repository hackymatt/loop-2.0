import { createMetadata } from "src/utils/create-metadata";

import { ActivateView } from "src/sections/auth/activate-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({ title: "Aktywuj konto" });

export default function Page() {
  return <ActivateView token={undefined} />;
}
