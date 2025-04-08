"use client";

import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { _marketingPosts } from "src/_mock";

import { MarketingPosts } from "../posts/marketing-posts";
import { MarketingNewsletter } from "../marketing-newsletter";
import { MarketingFeaturedPosts } from "../posts/marketing-featured-posts";
import { MarketingLandingFreeSEO } from "../landing/marketing-landing-free-seo";

// ----------------------------------------------------------------------

const posts = _marketingPosts.slice(0, 8);
const featuredPosts = _marketingPosts.slice(0, 5);

export function MarketingPostsView() {
  return (
    <>
      <MarketingFeaturedPosts posts={featuredPosts} />

      <Container component="section" sx={{ mt: 10 }}>
        <Grid container spacing={{ md: 8 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <MarketingPosts posts={posts} />
          </Grid>
        </Grid>
      </Container>

      <MarketingLandingFreeSEO />

      <MarketingNewsletter />
    </>
  );
}
