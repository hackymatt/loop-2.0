"use client";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { Form } from "src/components/hook-form";

import { FormHead } from "./components/form-head";
import { SignUpForm } from "./components/sign-up-form";
import { FormSocials } from "./components/form-socials";
import { FormDivider } from "./components/form-divider";
import { SignUpTerms } from "./components/sign-up-terms";
import { useSignUpSchema, type SignUpSchemaType } from "./components/schema";

// ----------------------------------------------------------------------
type Props = {
  header?: React.ReactNode;
  buttonText?: string;
};

export function SignUpView({ header, buttonText = "Utwórz konto" }: Props) {
  const { t } = useTranslation("sign-up");

  const defaultValues: SignUpSchemaType = {
    email: "",
    password: "",
    confirmPassword: "",
    termsAcceptance: false,
    dataProcessingConsent: false,
  };

  const SignUpSchema = useSignUpSchema();

  const methods = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema), defaultValues });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      {header ? (
        header
      ) : (
        <FormHead
          title={t("title")}
          description={
            <>
              {`${t("subtitle")} `}
              <Link component={RouterLink} href={paths.login} variant="subtitle2">
                {t("link")}
              </Link>
            </>
          }
        />
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <SignUpForm buttonText={buttonText ?? t("button")} />
        <SignUpTerms />
      </Form>

      <FormDivider label={t("or")} />

      <FormSocials />
    </>
  );
}
