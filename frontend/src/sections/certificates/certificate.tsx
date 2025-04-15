import type { BoxProps } from "@mui/material";
import type { ICertificateProps } from "src/types/certificate";

import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";

import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

import { fDate } from "src/utils/format-time";

import { CONFIG } from "src/global-config";

import { Logo } from "src/components/logo";

type Props = BoxProps & Omit<ICertificateProps, "id" | "completedAt"> & { completedAt?: string };

export function Certificate({
  courseName,
  studentName,
  completedAt = new Date().toISOString(),
  sx,
  ...other
}: Props) {
  const { t } = useTranslation("certificate");

  const boxRef = useRef(null);
  const [fontSize, setFontSize] = useState(14);
  const [logoSize, setLogoSize] = useState(24);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const scale = Math.min(width, height);
      setFontSize(Math.max(16, Math.min(32, scale / 16))); // font-size: 8–32px
      setLogoSize(Math.max(24, Math.min(64, scale / 10))); // logo-size: 16–64px
    });

    if (boxRef.current) observer.observe(boxRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={boxRef}
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
          textAlign: "center",
          fontSize: `${fontSize}px`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Logo isSingle isLink={false} sx={{ width: logoSize, height: logoSize, mb: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ fontSize: "0.7em", fontWeight: "bold", wordBreak: "break-word" }}>
          {t("label")}
        </Typography>
      </Box>

      {/* Participant info */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography color="primary" sx={{ fontSize: "0.7em", wordBreak: "break-word" }}>
          {t("award")}
        </Typography>
        <Typography sx={{ fontSize: "0.8em", fontWeight: "bold", wordBreak: "break-word" }}>
          {studentName}
        </Typography>
      </Box>

      {/* Course name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography color="primary" sx={{ fontSize: "0.7em", wordBreak: "break-word" }}>
          {t("completion")}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8em",
            fontWeight: "bold",
            wordBreak: "break-word",
          }}
        >
          {courseName}
        </Typography>
      </Box>

      {/* Completion date */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography color="primary" sx={{ fontSize: "0.6em", wordBreak: "break-word" }}>
          {t("date")}
        </Typography>
        <Typography sx={{ fontSize: "0.7em", fontWeight: "bold", wordBreak: "break-word" }}>
          {fDate(completedAt)}
        </Typography>
      </Box>
    </Box>
  );
}
