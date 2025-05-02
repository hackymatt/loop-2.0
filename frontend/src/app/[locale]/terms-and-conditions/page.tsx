import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { LANGUAGE } from "src/consts/language";

import { TermsAndConditionsView } from "src/sections/view/terms-and-conditions-view";

// ----------------------------------------------------------------------

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const translations = await import(`public/locales/${params.locale}/terms-and-conditions.json`);

  const path =
    params.locale === LANGUAGE.PL
      ? paths.termsAndConditions
      : `/${LANGUAGE.EN}${paths.termsAndConditions}`;

  return createMetadata({
    title: translations.meta.title,
    description: translations.meta.description,
    path,
  });
}
