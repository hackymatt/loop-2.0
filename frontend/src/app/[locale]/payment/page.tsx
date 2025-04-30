import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { PaymentView } from "src/sections/payment/view/payment-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Subskrypcja",
  path: paths.payment,
});

export default function Page() {
  return <PaymentView />;
}
