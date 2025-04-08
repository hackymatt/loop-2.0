"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { _socials, _travelPosts } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import { PostTags } from "../../blog/post-tags";
import { TravelNewsletter } from "../travel-newsletter";
import { TravelLatestPosts } from "../posts/travel-latest-posts";

// ----------------------------------------------------------------------

const post = _travelPosts[0];
const latestPosts = _travelPosts.slice(0, 4);

export function TravelPostView() {
  const renderSocials = () => (
    <Box sx={{ gap: 1.5, display: "flex", mt: 5 }}>
      <Box component="span" sx={{ lineHeight: "30px", typography: "subtitle2" }}>
        Share:
      </Box>

      <Box sx={{ gap: 1, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {_socials.map((social) => (
          <Button
            key={social.value}
            size="small"
            variant="outlined"
            startIcon={
              <>
                {social.value === "twitter" && <TwitterIcon />}
                {social.value === "facebook" && <FacebookIcon />}
                {social.value === "instagram" && <InstagramIcon />}
                {social.value === "linkedin" && <LinkedinIcon />}
              </>
            }
          >
            {social.label}
          </Button>
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Container />

      <Divider sx={{ mb: { xs: 6, md: 10 } }} />

      <Container>
        <Grid container spacing={{ md: 8 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" sx={{ mb: 5 }}>
              {post?.description}
            </Typography>

            {!!post?.tags?.length && <PostTags tags={post.tags} />}

            {renderSocials()}

            <Divider sx={{ mt: 10 }} />
          </Grid>
        </Grid>
      </Container>

      {!!latestPosts?.length && <TravelLatestPosts posts={latestPosts} />}

      <TravelNewsletter />
    </>
  );
}
