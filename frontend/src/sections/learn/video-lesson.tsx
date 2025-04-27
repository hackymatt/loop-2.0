import type { IVideoLessonProps } from "src/types/lesson";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button, Divider, Typography } from "@mui/material";

import { Player } from "src/components/player";
import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

type VideoLessonProps = { lesson: IVideoLessonProps; onSubmit: () => void };

// ----------------------------------------------------------------------

export function VideoLesson({ lesson, onSubmit }: VideoLessonProps) {
  const { t } = useTranslation("learn");

  const { name, videoUrl } = lesson;

  const renderHeader = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        {name}
      </Typography>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          width: { xs: 1, md: 0.5 },
          height: { xs: 320, md: 480 },
        }}
      >
        <Player controls url={videoUrl} width="100%" height="100%" />
      </Box>
    </Box>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Iconify icon="solar:check-circle-bold" />}
        onClick={onSubmit}
        sx={(theme) => ({
          px: 3,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "medium",
          boxShadow: theme.shadows[2],
        })}
      >
        {t("video.submit")}
      </Button>
    </Box>
  );

  return (
    <>
      {renderHeader()}
      <Divider />
      {renderContent()}
      <Divider sx={{ mt: "auto" }} />
      {renderSubmitButton()}
    </>
  );
}
