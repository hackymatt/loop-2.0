"use client";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

import { paths } from "src/routes/paths";

import { CONFIG } from "src/global-config";

import { Form, Field } from "src/components/hook-form";

import { FormHead } from "./components/form-head";
import { useResetPasswordSchema } from "./components/schema";
import { FormReturnLink } from "./components/form-return-link";

import type { ResetPasswordSchemaType } from "./components/schema";

// ----------------------------------------------------------------------

export function ResetPasswordView() {
  const { t } = useTranslation("reset-password");
  const { t: account } = useTranslation("account");

  const defaultValues: ResetPasswordSchemaType = { email: "" };

  const ResetPasswordSchema = useResetPasswordSchema();

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
      <Field.Text
        name="email"
        label={account("email.label")}
        placeholder="email@address.com"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <LoadingButton
        fullWidth
        size="large"
        color="inherit"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t("button")}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={
          <Box
            component="img"
            alt="Reset password"
            src={`${CONFIG.assetsDir}/assets/icons/auth/ic-lock-password.svg`}
            sx={{ width: 96, height: 96 }}
          />
        }
        title={t("title")}
        description={t("subtitle")}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.login} label={t("link")} />
    </>
  );
}
