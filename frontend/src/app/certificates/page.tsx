import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { CertificatesView } from "src/sections/view/certificates-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Certyfikaty",
  path: paths.certificates,
});
export default function Page() {
  return <CertificatesView />;
}
