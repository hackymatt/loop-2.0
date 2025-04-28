import { z as zod } from "zod";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

export type PaymentSchemaType = zod.infer<ReturnType<typeof usePaymentSchema>>;

export const usePaymentSchema = () => {
  const { t } = useTranslation("account");
  return zod.object({
    termsAcceptance: zod.boolean().refine((data) => data === true, {
      message: t("termsAcceptance.errors.required"),
    }),
  });
};
