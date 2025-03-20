import pluralize from "pluralize";
import { polishPlurals } from "polish-plurals";
import { useTranslation } from "react-i18next";

export function usePluralize() {
  const { t: locale } = useTranslation("locale");
  const language = locale("language");

  const languagePluralize = (wordVariants: string[], number: number) =>
    language === "pl"
      ? polishPlurals(wordVariants[0], wordVariants[1], wordVariants[2], number)
      : pluralize(wordVariants[0], number);

  return languagePluralize;
}
