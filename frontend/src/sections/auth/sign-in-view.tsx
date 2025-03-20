"use client";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "@mui/material/Link";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { Form } from "src/components/hook-form";

import { FormHead } from "./components/form-head";
import { useSignInSchema } from "./components/schema";
import { SignInForm } from "./components/sign-in-form";
import { FormSocials } from "./components/form-socials";
import { FormDivider } from "./components/form-divider";

import type { SignInSchemaType } from "./components/schema";

// ----------------------------------------------------------------------

export function SignInView() {
  const { t } = useTranslation("sign-in");

  const defaultValues: SignInSchemaType = { email: "", password: "" };

  const SignInSchema = useSignInSchema();

  const methods = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema), defaultValues });

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
      <FormHead
        title={t("title")}
        description={
          <>
            {`${t("subtitle")} `}
            <Link component={RouterLink} href={paths.register} variant="subtitle2">
              {t("link")}
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        <SignInForm buttonText={t("button")} forgotPasswordText={t("forgotPassword")} />
      </Form>

      <FormDivider label={t("or")} />

      <FormSocials />
    </>
  );
}
