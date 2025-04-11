"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useBoolean } from "minimal-shared/hooks";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { Iconify } from "src/components/iconify";
import { Form, Field } from "src/components/hook-form";

// ----------------------------------------------------------------------

const useAccountPasswordSchema = () => {
  const { t } = useTranslation("account");

  return zod
    .object({
      oldPassword: zod
        .string()
        .min(1, { message: t("oldPassword.errors.required") })
        .min(6, { message: t("oldPassword.errors.minLength") })
        .regex(/[A-Z]/, { message: t("oldPassword.errors.bigLetter") })
        .regex(/[a-z]/, { message: t("oldPassword.errors.smallLetter") })
        .regex(/[0-9]/, { message: t("oldPassword.errors.number") })
        .regex(/[!@#$%^&]/, {
          message: t("oldPassword.errors.specialCharacter"),
        }),
      newPassword: zod
        .string()
        .min(1, { message: t("newPassword.errors.required") })
        .min(6, { message: t("newPassword.errors.minLength") })
        .regex(/[A-Z]/, { message: t("newPassword.errors.bigLetter") })
        .regex(/[a-z]/, { message: t("newPassword.errors.smallLetter") })
        .regex(/[0-9]/, { message: t("newPassword.errors.number") })
        .regex(/[!@#$%^&]/, {
          message: t("newPassword.errors.specialCharacter"),
        }),
      confirmNewPassword: zod
        .string()
        .min(1, { message: t("confirmNewPassword.errors.required") })
        .min(6, { message: t("confirmNewPassword.errors.minLength") })
        .regex(/[A-Z]/, { message: t("confirmNewPassword.errors.bigLetter") })
        .regex(/[a-z]/, { message: t("confirmNewPassword.errors.smallLetter") })
        .regex(/[0-9]/, { message: t("confirmNewPassword.errors.number") })
        .regex(/[!@#$%^&]/, {
          message: t("confirmNewPassword.errors.specialCharacter"),
        }),
    })
    .refine((data) => data.oldPassword !== data.newPassword, {
      message: t("newPassword.errors.same"),
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("confirmNewPassword.errors.same"),
      path: ["confirmNewPassword"],
    });
};

type AccountPasswordSchemaType = zod.infer<ReturnType<typeof useAccountPasswordSchema>>;

// ----------------------------------------------------------------------

export function AccountManageView() {
  const { t } = useTranslation("account");

  const passwordShow = useBoolean();

  const AccountPasswordSchema = useAccountPasswordSchema();

  const passwordMethods = useForm<AccountPasswordSchemaType>({
    resolver: zodResolver(AccountPasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onSubmitPassword = passwordMethods.handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      passwordMethods.reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderChangePasswordForm = () => (
    <>
      <Field.Text
        name="oldPassword"
        label={t("oldPassword.label")}
        placeholder={t("oldPassword.placeholder")}
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify
                    icon={passwordShow.value ? "solar:eye-outline" : "solar:eye-closed-outline"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Field.Text
        name="newPassword"
        label={t("newPassword.label")}
        placeholder={t("newPassword.placeholder")}
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify
                    icon={passwordShow.value ? "solar:eye-outline" : "solar:eye-closed-outline"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Field.Text
        name="confirmNewPassword"
        label={t("confirmNewPassword.label")}
        placeholder={t("confirmNewPassword.placeholder")}
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={passwordShow.onToggle} edge="end">
                  <Iconify
                    icon={passwordShow.value ? "solar:eye-outline" : "solar:eye-closed-outline"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </>
  );

  return (
    <div>
      <Typography component="h6" variant="h5">
        {t("manage.title")}
      </Typography>

      <Form methods={passwordMethods} onSubmit={onSubmitPassword}>
        <Box sx={{ my: 3, gap: 2.5, display: "flex", flexDirection: "column" }}>
          {renderChangePasswordForm()}
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <LoadingButton
            color="inherit"
            type="submit"
            variant="contained"
            loading={passwordMethods.formState.isSubmitting}
          >
            {t("manage.button")}
          </LoadingButton>
        </Box>
      </Form>
    </div>
  );
}
