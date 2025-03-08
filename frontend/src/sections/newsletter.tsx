import type { BoxProps } from "@mui/material/Box";

import { z as zod } from "zod";
import { m } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import { InputAdornment } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";

import { CONFIG } from "src/global-config";
import { useMarketingConsent } from "src/consts/acceptances";

import { Form, Field } from "src/components/hook-form";

// ----------------------------------------------------------------------

export type NewsletterSchemaType = zod.infer<ReturnType<typeof useNewsletterSchema>>;

export const useNewsletterSchema = () => {
  const { t } = useTranslation("newsletter");
  return zod.object({
    email: zod
      .string()
      .min(1, { message: t("email.errors.required") })
      .email({ message: t("email.errors.invalid") }),
    marketingConsent: zod.boolean().refine((data) => data === true, {
      message: t("marketingConsent.errors.required"),
    }),
  });
};

// ----------------------------------------------------------------------

export function Newsletter({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("newsletter");

  const marketingConsent = useMarketingConsent();

  const defaultValues: NewsletterSchemaType = {
    email: "",
    marketingConsent: false,
  };

  const NewsletterSchema = useNewsletterSchema();

  const methods = useForm<NewsletterSchemaType>({
    resolver: zodResolver(NewsletterSchema),
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

  const renderContent = () => (
    <Box sx={{ mx: "auto", maxWidth: 480, textAlign: "center", color: "common.white" }}>
      <Box sx={{ gap: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box component="span" sx={{ textAlign: "right", typography: "h4" }}>
          {t("title.part1")}
          <br /> {t("title.part2")}
        </Box>

        <Box
          component="span"
          sx={(theme) => ({
            ...theme.mixins.textGradient(
              `90deg, ${theme.vars.palette.primary.main} 20%, ${theme.vars.palette.secondary.main} 100%`
            ),
            typography: "h1",
          })}
        >
          20%
        </Box>
      </Box>

      <Typography sx={{ mt: 3, mb: 5, opacity: 0.64 }}>{t("subtitle")}</Typography>
    </Box>
  );

  const renderForm = () => (
    <Box sx={{ gap: 2.5, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Field.Text
        name="email"
        label={t("email.label")}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <LoadingButton
                  color="primary"
                  size="large"
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  {t("button")}
                </LoadingButton>
              </InputAdornment>
            ),
            sx: {
              pr: 0.5,
              pl: 0.5,
              height: 56,
              borderRadius: 1,
              bgcolor: "common.white",
              "&:hover": {
                bgcolor: "common.white",
              },
              "&.Mui-focused": {
                bgcolor: "common.white",
              },
              "&.Mui-error": {
                bgcolor: "common.white",
              },
              "&.Mui-focused.Mui-error": {
                bgcolor: "common.white",
              },
            },
          },
        }}
      />

      <Field.Checkbox name="marketingConsent" label={marketingConsent} />
    </Box>
  );

  const renderInput = () => (
    <Form methods={methods} onSubmit={onSubmit}>
      {renderForm()}
    </Form>
  );

  return (
    <Box
      component="section"
      sx={[
        {
          overflow: "hidden",
          position: "relative",
          bgcolor: "common.black",
          py: { xs: 10, md: 15 },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          my: "auto",
          width: 760,
          height: 760,
          opacity: 0.24,
          position: "absolute",
          transform: "translateX(-50%)",
        }}
      >
        <Box
          component={m.img}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          alt="Texture"
          loading="lazy"
          src={`${CONFIG.assetsDir}/assets/background/texture-3.webp`}
        />
      </Box>

      <Container>
        <Box sx={{ mx: "auto", maxWidth: 480, textAlign: "center", color: "common.white" }}>
          {renderContent()}
          {renderInput()}
        </Box>
      </Container>
    </Box>
  );
}
