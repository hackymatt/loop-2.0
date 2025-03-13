import type { CardProps } from "@mui/material/Card";
import type { ICourseProps } from "src/types/course";

import { useTranslation } from "react-i18next";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { Box, Link } from "@mui/material";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { Iconify } from "src/components/iconify";

import { Certificate } from "../certificate";

// ----------------------------------------------------------------------

type Props = CardProps & Pick<ICourseProps, "slug">;
export function CourseCertificateDetailsInfo({ sx, slug, ...other }: Props) {
  const { t } = useTranslation("course");
  return (
    <Card
      sx={[
        { p: 3, gap: 2, borderRadius: 2, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography component="h6" variant="h6">
        {t("certificate.title")}
      </Typography>

      <Certificate title={slug} />

      <Typography variant="body2">{t("certificate.subtitle")}</Typography>

      <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
        <Iconify icon="carbon:checkmark-filled" sx={{ color: "success.main" }} />
        <Typography variant="caption">
          {t("included.start")}{" "}
          <Link href={paths.pricing} color="text.primary" underline="always">
            {t("included.plans")}
          </Link>
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        href={`${paths.register}?redirect=${paths.course}/${slug}`}
        sx={{ px: 2, borderRadius: "inherit", textAlign: "center" }}
      >
        {t("start")}
      </Button>
    </Card>
  );
}
