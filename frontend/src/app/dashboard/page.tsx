import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { DashboardView } from "src/sections/dashboard/view";
// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Dołącz teraz",
  description:
    "Rozpocznij naukę IT i zdobądź umiejętności, które pozwolą Ci rozwijać karierę w technologii. Zarejestruj się teraz za darmo w loop!",
  path: paths.register,
});

export default function Page() {
  return <DashboardView />;
}
