import { createMetadata } from "src/utils/create-metadata";

import { PricingView } from "src/sections/view/pricing-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Plany cenowe",
  "Sprawdź nasze plany cenowe i wybierz najlepszy kurs programowania dla siebie. Zdobądź umiejętności IT w przystępnej cenie. Zapisz się już dziś!"
);

export default function Page() {
  return <PricingView />;
}
