import type { BoxProps } from "@mui/material/Box";
import type { IAuthorProps } from "src/types/author";
import type { Theme, SxProps } from "@mui/material/styles";
import type { IPostProps, IPostCategoryProps } from "src/types/blog";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";

import { _socials } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import Search from "src/components/search/search";

import { PostItemMobile } from "./post-item-mobile";

// ----------------------------------------------------------------------

type PostSidebarProps = BoxProps & {
  searchValue: string;
  onSearch: (newValue: string) => void;
  tags?: string[];
  author?: IAuthorProps;
  recentPosts?: IPostProps[];
  categories?: IPostCategoryProps[];
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
  searchValue,
  onSearch,
  tags,
  slots,
  author,
  slotProps,
  categories,
  recentPosts,
  ...other
}: PostSidebarProps) {
  const { t } = useTranslation("blog");
  const renderSearch = () => (
    <Search
      placeholder={`${t("search")}...`}
      value={searchValue}
      onChange={(newValue) => onSearch?.(newValue as string)}
    />
  );

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

  const renderCategories = () =>
    !!categories?.length && (
      <Box sx={slotProps?.categories}>
        <Typography variant="h5">{t("categories")}</Typography>

        {categories.map((category) => (
          <Box key={category.label} sx={{ mt: 1, gap: 2, display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "primary.main" }}
            />

            <Link variant="body2" href={category.path} color="inherit">
              {category.label}
            </Link>
          </Box>
        ))}
      </Box>
    );

  const renderRecentPosts = () =>
    !!recentPosts?.length && (
      <Box sx={slotProps?.recentPosts}>
        <Typography variant="h5">{t("recentPosts")}</Typography>

        {recentPosts.map((post) => (
          <PostItemMobile key={post.id} post={post} onSidebar sx={{ mt: 2 }} />
        ))}
      </Box>
    );

  const renderPopularTags = () =>
    !!tags?.length && (
      <Box sx={slotProps?.tags}>
        <Typography variant="h5">{t("popularTags")}</Typography>

        <Box sx={{ mt: 2, gap: 1, display: "flex", flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              variant="soft"
              size="small"
              component="a"
              href={`${paths.posts}/?tag=${tag}`}
              clickable
            />
          ))}
        </Box>
      </Box>
    );

  return (
    <>
      {slots?.topNode}

      {renderAuthor()}
      {renderSearch()}

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
