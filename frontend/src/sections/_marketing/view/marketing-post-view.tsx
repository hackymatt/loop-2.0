"use client";

import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { _socials, _marketingPosts } from "src/_mock";
import { TwitterIcon, FacebookIcon, LinkedinIcon, InstagramIcon } from "src/assets/icons";

import { Iconify } from "src/components/iconify";

import { PostTags } from "../../blog/post-tags";
import { MarketingNewsletter } from "../marketing-newsletter";
import { MarketingLatestPosts } from "../posts/marketing-latest-posts";
import { MarketingLandingFreeSEO } from "../landing/marketing-landing-free-seo";

// ----------------------------------------------------------------------

const post = _marketingPosts[0];
const latestPosts = _marketingPosts.slice(0, 4);

export function MarketingPostView() {
  const openSocial = usePopover();

  const renderHead = () => (
    <Box sx={{ textAlign: "center", mt: { xs: 5, md: 10 } }}>
      <Typography variant="body2" sx={{ color: "text.disabled" }}>
        {post.duration}
      </Typography>
      <Typography component="p" variant="h5">
        {post.description}
      </Typography>
    </Box>
  );

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

  const renderMenuSocials = () => (
    <Popover
      open={openSocial.open}
      anchorEl={openSocial.anchorEl}
      onClose={openSocial.onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      slotProps={{ paper: { sx: { width: 220 } } }}
    >
      {_socials.map((social) => (
        <MenuItem key={social.value} onClick={() => openSocial.onClose()} sx={{ gap: 1 }}>
          {social.value === "twitter" && <TwitterIcon />}
          {social.value === "facebook" && <FacebookIcon />}
          {social.value === "instagram" && <InstagramIcon />}
          {social.value === "linkedin" && <LinkedinIcon />}
          Share via {social.label}
        </MenuItem>
      ))}
    </Popover>
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
      </Box>

      <IconButton onClick={openSocial.onOpen} color={openSocial.open ? "primary" : "default"}>
        <Iconify icon="solar:share-outline" />
      </IconButton>
    </Box>
  );

  return (
    <>
      <Divider />

      <Container component="section">
        <Grid container spacing={3} sx={{ justifyContent: { md: "center" } }}>
          <Grid size={{ xs: 12, md: 8 }}>
            {renderHead()}
            {renderToolbar()}

            {!!post.tags.length && <PostTags tags={post.tags} />}

            {renderSocials()}

            <Divider sx={{ mt: 10 }} />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <MarketingLatestPosts posts={latestPosts} />

      <MarketingLandingFreeSEO />

      <MarketingNewsletter />

      {renderMenuSocials()}
    </>
  );
}
