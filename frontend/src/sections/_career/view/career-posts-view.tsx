"use client";

import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { _careerPosts } from "src/_mock";

import { CareerPosts } from "../posts/career-posts";
import { CareerNewsletter } from "../career-newsletter";

// ----------------------------------------------------------------------

const posts = _careerPosts.slice(0, 8);

export function CareerPostsView() {
  return (
    <>
      <Container sx={{ pt: { md: 5 }, pb: { md: 15 } }}>
        <Grid container spacing={{ md: 8 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <CareerPosts posts={posts} />
          </Grid>
        </Grid>
      </Container>
      <CareerNewsletter />
    </>
  );
}
