"use client";

import type { BoxProps } from "@mui/material/Box";

import { z as zod } from "zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Divider } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useQueryParams } from "src/hooks/use-query-params";

import { usePlan } from "src/api/plan/plan";

import { useUserContext } from "src/components/user";
import { Form, Field } from "src/components/hook-form";
import { SplashScreen } from "src/components/loading-screen";

import { NotFoundView } from "src/sections/error/not-found-view";

import { PaymentForm } from "../payment-form";
import { PaymentSummary } from "../payment-summary";

const useCustomerSchema = () => {
  const { t } = useTranslation("account");

  return zod.object({
    email: zod
      .string()
      .min(1, { message: t("email.errors.required") })
      .email({ message: t("email.errors.invalid") }),
    firstName: zod.string().min(1, { message: t("firstName.errors.required") }),
    lastName: zod.string().min(1, { message: t("lastName.errors.required") }),
  });
};

const usePaymentMethods = () => {
  const { t } = useTranslation("payment");

  return zod.object({
    method: zod.enum(["card", "applepay", "googlepay"]),
    card: zod.object({
      number: zod
        .string()
        .min(16, { message: t("card.number.errors.required") })
        .max(16, { message: t("card.number.errors.invalid") })
        .regex(/^\d+$/, { message: t("card.number.errors.invalid") }),
      holder: zod.string().min(1, { message: t("card.holder.errors.required") }),
      expiration: zod
        .string()
        .min(5, { message: t("card.expiration.errors.required") })
        .max(5, { message: t("card.expiration.errors.invalid") })
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: t("card.expiration.errors.invalid") })
        .refine(
          (value) => {
            const [month, year] = value.split("/");
            const expirationDate = new Date(Number(`20${year}`), parseInt(month, 10) - 1);
            const currentDate = new Date();
            return expirationDate > currentDate;
          },
          { message: t("card.expiration.errors.invalid") }
        ),
      security: zod
        .string()
        .min(3, { message: t("card.security.errors.required") })
        .max(3, { message: t("card.security.errors.invalid") }),
    }),
  });
};

// ----------------------------------------------------------------------

export function PaymentView() {
  const { query } = useQueryParams();

  const { t: account } = useTranslation("account");
  const { t } = useTranslation("payment");

  const user = useUserContext();
  const { email, firstName, lastName } = user.state;

  const { data: plan, isLoading, isError } = usePlan(query.plan);

  const PaymentSchema = zod.object({
    customer: useCustomerSchema(),
    paymentMethods: usePaymentMethods(),
  });

  type PaymentSchemaType = zod.infer<typeof PaymentSchema>;

  const defaultValues: PaymentSchemaType = {
    customer: {
      email: email || "",
      firstName: firstName || "",
      lastName: lastName || "",
    },
    paymentMethods: {
      method: "card",
      card: { number: "", holder: "", expiration: "", security: "" },
    },
  };

  const methods = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   router.push(paths.travel.orderCompleted);
    //   console.info("DATA", data);
    // } catch (error) {
    //   console.error(error);
    // }
  });
  if (isError) {
    return <NotFoundView />;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  const renderAccountDetails = () => (
    <>
      <StepLabel title={t("customer.label")} step="1" />
      <Box sx={{ gap: 5, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            rowGap: 2,
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
          }}
        >
          <Field.Text name="customer.email" label={account("email.label")} disabled />
          <Field.Text name="customer.firstName" label={account("firstName.label")} />
          <Field.Text name="customer.lastName" label={account("lastName.label")} />
        </Box>
      </Box>
    </>
  );

  const renderPaymentMethods = () => (
    <>
      <StepLabel title={t("paymentMethods.label")} step="2" />
      <PaymentForm
        name="paymentMethods.method"
        options={[
          {
            label: t("paymentMethods.card.label"),
            value: "card",
            description: t("paymentMethods.card.description"),
          },
          {
            label: t("paymentMethods.applepay.label"),
            value: "applepay",
            description: t("paymentMethods.applepay.description"),
          },
          {
            label: t("paymentMethods.googlepay.label"),
            value: "googlepay",
            description: t("paymentMethods.googlepay.description"),
          },
        ]}
      />
    </>
  );

  return (
    <Container sx={{ pb: 10, pt: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 2, textAlign: "center" }}>
        {t("title")}
      </Typography>

      <Typography sx={{ textAlign: "center", color: "text.secondary", mb: 5 }}>
        {t("subtitle").replace("{plan}", plan?.license || "")}
      </Typography>

      <Grid container spacing={{ xs: 5, md: 8 }}>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid size={{ xs: 12, md: 12 }}>
            {renderAccountDetails()}

            <Divider sx={{ my: 5, borderStyle: "dashed" }} />

            {renderPaymentMethods()}
          </Grid>
        </Form>

        <Grid size={{ xs: 12, md: 5 }}>{plan && <PaymentSummary plan={plan} />}</Grid>
      </Grid>
    </Container>
  );
}

// ----------------------------------------------------------------------

type StepLabelProps = BoxProps & {
  step: string;
  title: string;
};

function StepLabel({ step, title, sx, ...other }: StepLabelProps) {
  return (
    <Box
      sx={[
        { mb: 3, gap: 1.5, display: "flex", typography: "h6", alignItems: "center" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          flexShrink: 0,
          display: "flex",
          borderRadius: "50%",
          alignItems: "center",
          typography: "subtitle1",
          bgcolor: "primary.main",
          justifyContent: "center",
          color: "primary.contrastText",
        }}
      >
        {step}
      </Box>

      {title}
    </Box>
  );
}
