"use client";

import { useTranslation } from "react-i18next";

import { paths } from "src/routes/paths";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export const useNavData = () => {
  const { t } = useTranslation("account");

  return [
    {
      title: t("personal.title"),
      path: paths.account.personal,
      icon: <Iconify icon="solar:user-rounded-outline" />,
    },
    {
      title: t("manage.title"),
      path: paths.account.manage,
      icon: <Iconify icon="solar:settings-outline" />,
    },
    {
      title: t("subscription.title"),
      path: paths.account.subscription,
      icon: <Iconify icon="solar:card-outline" />,
    },
  ];
};
