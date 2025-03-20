import type { BoxProps } from "@mui/material";

import { useTranslation } from "react-i18next";

import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import { fDate } from "src/utils/format-time";

import { CONFIG } from "src/global-config";

import { Logo } from "src/components/logo";

type Props = BoxProps & { course: string; student: string };

export function Certificate({ course, student, sx, ...other }: Props) {
  const { t } = useTranslation("certificate");
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [`url(${CONFIG.assetsDir}/assets/background/texture-2.webp)`],
          }),
          width: 1,
          height: "100%",
          borderRadius: 1.5,
          bgcolor: "background.neutral",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          gap: 1,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Logo isSingle sx={{ width: "7%", height: "auto", mb: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.7em", fontWeight: "bold", wordBreak: "break-word" }}>
          {t("title")}
        </Typography>
      </Box>

      {/* Participant info */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography color="primary" sx={{ fontSize: "0.7em", wordBreak: "break-word" }}>
          {t("award")}
        </Typography>
        <Typography sx={{ fontSize: "0.8em", fontWeight: "bold", wordBreak: "break-word" }}>
          {student}
        </Typography>
      </Box>

      {/* Course name */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography color="primary" sx={{ fontSize: "0.7em", wordBreak: "break-word" }}>
          {t("completion")}
        </Typography>
        <Typography sx={{ fontSize: "0.8em", fontWeight: "bold", wordBreak: "break-word" }}>
          {course}
        </Typography>
      </Box>

      {/* Completion date */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography color="primary" sx={{ fontSize: "0.6em", wordBreak: "break-word" }}>
          {t("date")}
        </Typography>
        <Typography sx={{ fontSize: "0.7em", fontWeight: "bold", wordBreak: "break-word" }}>
          {fDate(new Date())}
        </Typography>
      </Box>
    </Box>
  );
}
