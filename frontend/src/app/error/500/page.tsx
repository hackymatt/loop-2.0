import { createMetadata } from "src/utils/create-metadata";

import { Error500View } from "src/sections/error/500-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({ title: "500 Błąd serwera" });

export default function Page500() {
  return <Error500View />;
}
