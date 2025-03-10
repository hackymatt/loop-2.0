"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";

import { fDate } from "src/utils/format-time";

import { _coursePosts } from "src/_mock";

import { Image } from "src/components/image";
import { Iconify } from "src/components/iconify";
import { Markdown } from "src/components/markdown";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { PostTags } from "../blog/post-tags";
import { PostAuthor } from "../blog/post-author";
import { LatestPosts } from "../posts/latest-posts";
import { PrevNextButton } from "../blog/post-prev-and-next";

// ----------------------------------------------------------------------

const post = _coursePosts[0];
const prevPost = _coursePosts[1];
const nextPost = _coursePosts[2];
const latestPosts = _coursePosts;

export function PostView() {
  const { t } = useTranslation("navigation");

  const [favorite, setFavorite] = useState(post.favorited);

  const handleChangeFavorite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFavorite(event.target.checked);
  }, []);

  const renderHead = () => (
    <Box sx={{ textAlign: "center", mt: { xs: 5, md: 10 } }}>
      <Typography variant="body2" sx={{ color: "text.disabled" }}>
        {post.duration}
      </Typography>

      <Typography variant="h2" component="h1" sx={{ my: 3 }}>
        {post.title}
      </Typography>

      <Typography variant="h5" component="p">
        {post.description}
      </Typography>
    </Box>
  );

  const renderToolbar = () => (
    <Box
      sx={[
        (theme) => ({
          py: 3,
          my: 5,
          display: "flex",
          alignItems: "center",
          borderTop: `solid 1px ${theme.vars.palette.divider}`,
          borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        }),
      ]}
    >
      <Avatar src={post.author.avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{post.author.name}</Typography>
        <Typography variant="caption" sx={{ mt: 0.5, display: "block", color: "text.secondary" }}>
          {fDate(post.createdAt)}
        </Typography>
      </Box>

      <IconButton
        onClick={() =>
          navigator.share({
            url: `${paths.post}/${post.title}/`,
            title: post?.title,
            text: post?.description,
          })
        }
      >
        <Iconify icon="solar:share-outline" />
      </IconButton>
      <Checkbox
        color="error"
        checked={favorite}
        onChange={handleChangeFavorite}
        icon={<Iconify icon="solar:heart-outline" />}
        checkedIcon={<Iconify icon="solar:heart-bold" />}
        inputProps={{ id: "favorite-checkbox", "aria-label": "Favorite checkbox" }}
      />
    </Box>
  );

  const renderVideo = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <Image
        alt={post.title}
        src={post.heroUrl}
        ratio={{ xs: "16/9", md: "21/9" }}
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );
  const renderPrevNextButtons = () => (
    <Box
      sx={{
        gap: 5,
        py: 10,
        display: "grid",
        gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
      }}
    >
      <PrevNextButton title={prevPost?.title} coverUrl={prevPost?.coverUrl} href="#" />
      <PrevNextButton isNext title={nextPost?.title} coverUrl={nextPost?.coverUrl} href="#" />
    </Box>
  );

  return (
    <>
      <Divider />

      <Container>
        <CustomBreadcrumbs
          links={[
            { name: t("home"), href: "/" },
            { name: t("blog"), href: paths.eLearning.posts },
            { name: post.title },
          ]}
          sx={{ my: { xs: 3, md: 5 } }}
        />
        {renderVideo()}
        <Grid container spacing={3} sx={{ justifyContent: { md: "center" } }}>
          <Grid size={{ xs: 12, md: 8 }}>
            {renderHead()}

            {renderToolbar()}

            <Markdown content={post.content} />

            {!!post.tags.length && <PostTags tags={post.tags} />}

            <Divider sx={{ mt: 10 }} />

            <PostAuthor author={post.author} />

            <Divider />

            {renderPrevNextButtons()}
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <LatestPosts largePost={latestPosts[0]} smallPosts={latestPosts.slice(1, 5)} />
    </>
  );
}
