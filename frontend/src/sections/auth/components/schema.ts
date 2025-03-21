import { z as zod } from "zod";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<ReturnType<typeof useSignInSchema>>;

export const useSignInSchema = () => {
  const { t } = useTranslation("account");

  return zod.object({
    email: zod
      .string()
      .min(1, { message: t("email.errors.required") })
      .email({ message: t("email.errors.invalid") }),
    password: zod
      .string()
      .min(1, { message: t("password.errors.required") })
      .min(6, { message: t("password.errors.minLength") })
      .regex(/[A-Z]/, { message: t("password.errors.bigLetter") })
      .regex(/[a-z]/, { message: t("password.errors.smallLetter") })
      .regex(/[0-9]/, { message: t("password.errors.number") })
      .regex(/[!@#$%^&]/, {
        message: t("password.errors.specialCharacter"),
      }),
  });
};

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<ReturnType<typeof useSignUpSchema>>;

export const useSignUpSchema = () => {
  const { t } = useTranslation("account");
  return zod.object({
    email: zod
      .string()
      .min(1, { message: t("email.errors.required") })
      .email({ message: t("email.errors.invalid") }),
    password: zod
      .string()
      .min(1, { message: t("password.errors.required") })
      .min(6, { message: t("password.errors.minLength") })
      .regex(/[A-Z]/, { message: t("password.errors.bigLetter") })
      .regex(/[a-z]/, { message: t("password.errors.smallLetter") })
      .regex(/[0-9]/, { message: t("password.errors.number") })
      .regex(/[!@#$%^&]/, {
        message: t("password.errors.specialCharacter"),
      }),
    termsAcceptance: zod.boolean().refine((data) => data === true, {
      message: t("termsAcceptance.errors.required"),
    }),
    dataProcessingConsent: zod.boolean().refine((data) => data === true, {
      message: t("dataProcessingConsent.errors.required"),
    }),
  });
};

// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = zod.infer<ReturnType<typeof useResetPasswordSchema>>;

export const useResetPasswordSchema = () => {
  const { t } = useTranslation("account");
  return zod.object({
    email: zod
      .string()
      .min(1, { message: t("email.errors.required") })
      .email({ message: t("email.errors.invalid") }),
  });
};
// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = zod.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .min(6, { message: "Code must be at least 6 characters!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
  password: zod
    .string()
    .min(1, { message: "Password is required!" })
    .min(6, { message: "Password must be at least 6 characters!" }),
});

// ----------------------------------------------------------------------

export type VerifySchemaType = zod.infer<typeof VerifySchema>;

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: "Code is required!" })
    .min(6, { message: "Code must be at least 6 characters!" }),
});
