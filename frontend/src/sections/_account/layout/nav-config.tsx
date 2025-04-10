import { paths } from "src/routes/paths";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export const navData = [
  {
    title: "Personal",
    path: paths.account.personal,
    icon: <Iconify icon="solar:user-rounded-outline" />,
  },
  {
    title: "Manage",
    path: paths.account.manage,
    icon: <Iconify icon="solar:settings-outline" />,
  },
  {
    title: "Subscription",
    path: paths.account.subscription,
    icon: <Iconify icon="solar:card-outline" />,
  },
];
