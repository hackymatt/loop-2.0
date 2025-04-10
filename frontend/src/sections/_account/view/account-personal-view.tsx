"use client";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { varAlpha } from "minimal-shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { Form, Field } from "src/components/hook-form";

import { UserPhoto } from "src/sections/_account/layout";

// ----------------------------------------------------------------------

export type AccountPersonalSchemaType = zod.infer<typeof AccountPersonalSchema>;

export const AccountPersonalSchema = zod.object({
  firstName: zod.string().min(1, { message: "First name is required!" }),
  lastName: zod.string().min(1, { message: "Last name is required!" }),
  email: zod
    .string()
    .min(1, { message: "Email is required!" })
    .email({ message: "Email must be a valid email address!" }),
});

// ----------------------------------------------------------------------

export function AccountPersonalView() {
  const personalMethods = useForm<AccountPersonalSchemaType>({
    resolver: zodResolver(AccountPersonalSchema),
    defaultValues: {
      firstName: "Jayvion",
      lastName: "Simon",
      email: "nannie.abernathy70@yahoo.com",
    },
  });

  const onSubmitPersonal = personalMethods.handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      personalMethods.reset();
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderPersonalForm = () => (
    <>
      <Field.Text name="firstName" label="First name" />
      <Field.Text name="lastName" label="Last name" />
      <Field.Text name="email" label="Email address" disabled />
    </>
  );

  return (
    <div>
      <Typography component="h6" variant="h5">
        Personal
      </Typography>

      <UserPhoto
        sx={(theme) => ({
          p: 3,
          mt: 3,
          borderRadius: 2,
          display: { xs: "flex", md: "none" },
          border: `solid 1px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.24)}`,
        })}
      />

      <Form methods={personalMethods} onSubmit={onSubmitPersonal}>
        <Box
          sx={{
            my: 3,
            rowGap: 2.5,
            columnGap: 2,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
          }}
        >
          {renderPersonalForm()}
        </Box>

        <Box sx={{ textAlign: "right" }}>
          <LoadingButton
            color="inherit"
            type="submit"
            variant="contained"
            loading={personalMethods.formState.isSubmitting}
          >
            Save changes
          </LoadingButton>
        </Box>
      </Form>
    </div>
  );
}
