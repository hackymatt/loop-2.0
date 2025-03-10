import type { IPostProps } from "src/types/blog";
import type { BoxProps } from "@mui/material/Box";
import type { IAuthorProps } from "src/types/author";
import type { Theme, SxProps } from "@mui/material/styles";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Stack, Checkbox, FormControlLabel } from "@mui/material";

import { useResponsive } from "src/hooks/use-responsive";
import { useQueryParams } from "src/hooks/use-query-params";

import { _socials } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import Search from "src/components/search/search";

import { PostItemMobile } from "./post-item-mobile";

// ----------------------------------------------------------------------

type PostSidebarProps = BoxProps & {
  tags?: string[];
  author?: IAuthorProps;
  recentPosts?: IPostProps[];
  categories?: string[];
  slots?: {
    topNode?: React.ReactNode;
    bottomNode?: React.ReactNode;
  };
  slotProps?: {
    tags?: SxProps<Theme>;
    author?: SxProps<Theme>;
    categories?: SxProps<Theme>;
    recentPosts?: SxProps<Theme>;
  };
};

export function PostSidebar({
  sx,
  tags,
  slots,
  author,
  slotProps,
  categories,
  recentPosts,
  ...other
}: PostSidebarProps) {
  const { t } = useTranslation("blog");

  const { query, handleChange } = useQueryParams();

  const mdUp = useResponsive("up", "md");

  const renderSearch = () => {
    const currentValue = query?.search ?? "";
    return (
      <Search
        placeholder={`${t("search")}...`}
        value={currentValue}
        onChange={(newValue) => handleChange("search", newValue as string)}
        sx={{ display: { xs: "none", md: "inline-flex" } }}
      />
    );
  };

  const renderSocials = () => (
    <Box sx={{ display: "flex" }}>
      {_socials.map((social) => (
        <IconButton key={social.label}>
          {social.value === "twitter" && <TwitterIcon />}
          {social.value === "facebook" && <FacebookIcon />}
          {social.value === "instagram" && <InstagramIcon />}
          {social.value === "linkedin" && <LinkedinIcon />}
        </IconButton>
      ))}
    </Box>
  );

  const renderAuthor = () =>
    author && (
      <Box
        sx={[
          {
            gap: 2,
            mb: { md: 5 },
            display: { xs: "none", md: "flex" },
          },
          ...(Array.isArray(slotProps?.author) ? (slotProps?.author ?? []) : [slotProps?.author]),
        ]}
      >
        <Avatar src={author.avatarUrl} sx={{ width: 64, height: 64 }} />

        <div>
          <Typography component="span" variant="h6">
            {author.name}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ mb: 1, mt: 0.5, display: "block", color: "text.secondary" }}
          >
            {author.role}
          </Typography>

          {renderSocials()}
        </div>
      </Box>
    );

  const renderCategories = () => {
    const currentValue = query?.category ?? "";
    return (
      !!categories?.length && (
        <Box sx={slotProps?.categories}>
          <Typography variant="h5">{t("categories")}</Typography>

          <Stack spacing={0.5} alignItems="flex-start" mt={1}>
            {categories.map((category) => {
              const isSelected = currentValue.includes(category);
              return (
                <FormControlLabel
                  key={category}
                  value={category}
                  control={
                    <Checkbox
                      color="error"
                      value={category}
                      checked={isSelected}
                      onChange={() =>
                        currentValue !== category
                          ? handleChange("category", category)
                          : handleChange("category", "")
                      }
                      sx={{ display: "none" }}
                    />
                  }
                  label={
                    <Box key={category} gap={2} display="flex" alignItems="center">
                      <Box
                        component="span"
                        sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }}
                      />

                      {category}
                    </Box>
                  }
                  sx={{
                    m: 0,
                    fontWeight: "fontWeightSemiBold",
                    "&:hover": { color: "primary.main" },
                    ...(category === currentValue && {
                      color: "primary.main",
                    }),
                  }}
                />
              );
            })}
          </Stack>
        </Box>
      )
    );
  };

  const renderRecentPosts = () =>
    !!recentPosts?.length && (
      <Box sx={slotProps?.recentPosts}>
        <Typography variant="h5">{t("recentPosts")}</Typography>

        {recentPosts.map((post) => (
          <PostItemMobile key={post.id} post={post} onSidebar sx={{ mt: 2 }} />
        ))}
      </Box>
    );

  const renderPopularTags = () => {
    const currentValue = query?.tags;
    const currentTags = currentValue ? currentValue.split(",") : [];
    return (
      !!tags?.length && (
        <Box sx={slotProps?.tags}>
          <Typography variant="h5">{t("popularTags")}</Typography>

          <Box sx={{ mt: 2, gap: 1, display: "flex", flexWrap: "wrap" }}>
            {tags.map((tag) => {
              const isSelected = currentTags.includes(tag);
              return (
                <Chip
                  key={tag}
                  label={tag}
                  variant={isSelected ? "filled" : "outlined"}
                  size="small"
                  component="a"
                  clickable
                  onClick={() => {
                    if (isSelected) {
                      handleChange(
                        "tags",
                        currentTags.filter((currentTag: string) => currentTag !== tag).join(",")
                      );
                    } else {
                      handleChange("tags", [...currentTags, tag].join(","));
                    }
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )
    );
  };

  return (
    <>
      {slots?.topNode}

      {renderAuthor()}
      {mdUp && renderSearch()}

      <Box
        sx={[
          {
            gap: 5,
            display: "flex",
            flexDirection: "column",
            pt: { md: 5 },
            pb: { xs: 10, md: 0 },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderCategories()}
        {renderRecentPosts()}
        {renderPopularTags()}

        {slots?.bottomNode}
      </Box>
    </>
  );
}
