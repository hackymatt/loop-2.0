"use client";

import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { _travelPosts } from "src/_mock";

import { TravelPosts } from "../posts/travel-posts";
import { TravelNewsletter } from "../travel-newsletter";
import { TravelFeaturedPosts } from "../posts/travel-featured-posts";
import { TravelTrendingTopics } from "../posts/travel-trending-topics";

// ----------------------------------------------------------------------

const posts = _travelPosts.slice(0, 8);
const featuredPosts = _travelPosts.slice(-5);

export function TravelPostsView() {
  return (
    <>
      <TravelFeaturedPosts largePost={featuredPosts[0]} smallPosts={featuredPosts.slice(1, 5)} />

      <TravelTrendingTopics />

      <Container sx={{ mt: { xs: 4, md: 10 } }}>
        <Grid container spacing={{ md: 8 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TravelPosts posts={posts} />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} />
        </Grid>
      </Container>
      <TravelNewsletter />
    </>
  );
}
