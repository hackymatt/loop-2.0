import type { BoxProps } from "@mui/material/Box";
import type { IVideoLessonProps } from "src/types/lesson";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";

import { Player } from "src/components/player";

import { ComponentBox } from "./component-box";

// ----------------------------------------------------------------------

type VideoLessonProps = BoxProps & { lesson: IVideoLessonProps; onSubmit: () => void };

// ----------------------------------------------------------------------

export function VideoLesson({ lesson, onSubmit, sx, ...other }: VideoLessonProps) {
  const { t } = useTranslation("learn");

  const { videoUrl } = lesson;

  const renderContent = () => (
    <ComponentBox sx={{ py: 2, height: { xs: 300, md: 600 } }}>
      <Player controls url={videoUrl} width="100%" height="100%" />
    </ComponentBox>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" color="primary" size="large" onClick={onSubmit} sx={{ px: 2 }}>
        {t("video.submit")}
      </Button>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        { overflow: "hidden", gap: 2, p: 1, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderContent()}
      {renderSubmitButton()}
    </Box>
  );
}
