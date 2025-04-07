"use client";

import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { _coursePosts } from "src/_mock";

import { ElearningPosts } from "../posts/elearning-posts";
import { ElearningNewsletter } from "../elearning-newsletter";
import { ElearningFeaturedPost } from "../posts/elearning-featured-post";

// ----------------------------------------------------------------------

const posts = _coursePosts.slice(0, 8);
const featuredPost = _coursePosts[3];

export function ElearningPostsView() {
  return (
    <>
      <ElearningFeaturedPost post={featuredPost} />
      <Container sx={{ pt: 10 }}>
        <Grid container spacing={{ md: 8 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <ElearningPosts posts={posts} />
          </Grid>
        </Grid>
      </Container>
      <ElearningNewsletter />
    </>
  );
}
