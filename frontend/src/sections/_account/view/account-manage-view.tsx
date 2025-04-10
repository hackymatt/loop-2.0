"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
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

export type AccountPasswordSchemaType = zod.infer<typeof AccountPasswordSchema>;

export const AccountPasswordSchema = zod
  .object({
    oldPassword: zod
      .string()
      .min(1, { message: "Password is required!" })
      .min(6, { message: "Password must be at least 6 characters!" }),
    newPassword: zod.string().min(1, { message: "New password is required!" }),
    confirmNewPassword: zod.string().min(1, { message: "Confirm password is required!" }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different than old password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match!",
    path: ["confirmNewPassword"],
  });

// ----------------------------------------------------------------------

export function AccountManageView() {
  const passwordShow = useBoolean();

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
        label="Old password"
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
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
        label="New password"
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
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
        label="Confirm password"
        type={passwordShow.value ? "text" : "password"}
        slotProps={{
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
        Change password
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
            Save changes
          </LoadingButton>
        </Box>
      </Form>
    </div>
  );
}
