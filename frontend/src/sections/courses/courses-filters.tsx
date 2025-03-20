import type { BoxProps } from "@mui/material/Box";

import { useTranslation } from "react-i18next";
import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Rating from "@mui/material/Rating";
import Collapse from "@mui/material/Collapse";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useQueryParams } from "src/hooks/use-query-params";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

type FiltersProps = {
  open: boolean;
  onClose: () => void;
  options: {
    levels: string[];
    technologies: string[];
    categories: string[];
    ratings: string[];
  };
};

export function CoursesFilters({ open, onClose, options }: FiltersProps) {
  const { t } = useTranslation("course");

  const { handleChange, query } = useQueryParams();

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  const renderContent = () => {
    const levels = query?.levels;
    const currentLevels = levels ? levels.split(",") : [];

    const technologies = query?.technologies;
    const currentTechnologies = technologies ? technologies.split(",") : [];

    const categories = query?.categories;
    const currentCategories = categories ? categories.split(",") : [];

    const currentRating = query?.rating ?? "";

    return (
      <>
        <Block title={t("filter.level")}>
          <Box sx={{ display: "flex", flexDirection: "column", pt: 1 }}>
            {options.levels.map((option) => {
              const isSelected = currentLevels.includes(option);
              return (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      value={option}
                      checked={isSelected}
                      onChange={() => {
                        handleChange("levels", getSelected(currentLevels, option).join(","));
                      }}
                      inputProps={{ id: `${option}-checkbox` }}
                    />
                  }
                  label={option}
                />
              );
            })}
          </Box>
        </Block>

        <Block title={t("filter.technology")}>
          <Box sx={{ display: "flex", flexDirection: "column", pt: 1 }}>
            {options.technologies.map((option) => {
              const isSelected = currentTechnologies.includes(option);
              return (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      value={option}
                      checked={isSelected}
                      onChange={() => {
                        handleChange(
                          "technologies",
                          getSelected(currentTechnologies, option).join(",")
                        );
                      }}
                      inputProps={{ id: `${option}-checkbox` }}
                    />
                  }
                  label={option}
                />
              );
            })}
          </Box>
        </Block>

        <Block title={t("filter.category")}>
          <Box sx={{ display: "flex", flexDirection: "column", pt: 1 }}>
            {options.categories.map((option) => {
              const isSelected = currentCategories.includes(option);
              return (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      size="small"
                      value={option}
                      checked={isSelected}
                      onChange={() => {
                        handleChange(
                          "categories",
                          getSelected(currentCategories, option).join(",")
                        );
                      }}
                      inputProps={{ id: `${option}-checkbox` }}
                    />
                  }
                  label={option}
                />
              );
            })}
          </Box>
        </Block>

        <Block title={t("filter.rating.title")}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {options.ratings.map((option, index) => (
              <Box
                key={option}
                sx={{
                  gap: 1,
                  display: "flex",
                  alignItems: "center",
                  py: 1,
                  opacity: 0.48,
                  cursor: "pointer",
                  typography: "body2",
                  "&:hover": { opacity: 1 },

                  ...(currentRating === option && { opacity: 1, fontWeight: "fontWeightSemiBold" }),
                }}
              >
                <FormControlLabel
                  key={option}
                  value={option}
                  control={
                    <Checkbox
                      checked={currentRating === option}
                      onClick={() =>
                        currentRating !== option
                          ? handleChange("rating", option)
                          : handleChange("rating", "")
                      }
                      sx={{ display: "none" }}
                    />
                  }
                  label={
                    <Stack direction="row" alignItems="center" spacing={1} ml={1}>
                      <Rating size="small" value={4 - index} readOnly />
                      <Typography variant="body2">{t("filter.rating.more")}</Typography>
                    </Stack>
                  }
                />
              </Box>
            ))}
          </Box>
        </Block>
      </>
    );
  };

  const renderDesktop = () => (
    <Box
      sx={{
        gap: 3,
        width: 280,
        flexShrink: 0,
        flexDirection: "column",
        display: { xs: "none", md: "flex" },
      }}
    >
      {renderContent()}
    </Box>
  );

  const renderMobile = () => (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { p: 3, gap: 2.5, width: 280, display: "flex", flexDirection: "column" } }}
    >
      {renderContent()}
    </Drawer>
  );

  return (
    <>
      {renderDesktop()}
      {renderMobile()}
    </>
  );
}

// ----------------------------------------------------------------------

type BlockProps = BoxProps & {
  title: string;
};

function Block({ title, children, sx, ...other }: BlockProps) {
  const contentOpen = useBoolean(true);

  return (
    <Box
      sx={[{ display: "flex", flexDirection: "column" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Box
        onClick={contentOpen.onToggle}
        sx={{ display: "flex", alignItems: "center", width: 1, cursor: "pointer" }}
      >
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <Iconify width={16} icon={contentOpen.value ? "eva:minus-outline" : "eva:plus-outline"} />
      </Box>

      <Collapse unmountOnExit in={contentOpen.value} sx={{ px: 0.25 }}>
        {children}
      </Collapse>
    </Box>
  );
}
