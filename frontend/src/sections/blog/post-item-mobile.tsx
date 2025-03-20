import type { IPostProps } from "src/types/blog";
import type { BoxProps } from "@mui/material/Box";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";

import { Image } from "src/components/image";

import { PostTime } from "./post-time";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  post: IPostProps;
  onSidebar?: boolean;
};

export function PostItemMobile({ post, onSidebar, sx, ...other }: Props) {
  return (
    <Link
      component={RouterLink}
      href={`${paths.post}/${post.slug}/`}
      color="inherit"
      underline="none"
    >
      <Box
        sx={[
          {
            gap: 2,
            width: 1,
            display: "flex",
            alignItems: { xs: "flex-start", md: "unset" },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Image
          alt={post.title}
          src={post.coverUrl}
          sx={{ width: 64, height: 64, flexShrink: 0, borderRadius: 1.5 }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="inherit"
            variant={onSidebar ? "subtitle2" : "subtitle1"}
            sx={(theme) => ({
              ...theme.mixins.maxLine({
                line: 2,
                persistent: onSidebar ? theme.typography.subtitle2 : theme.typography.subtitle1,
              }),
              mb: onSidebar ? 0.5 : 1,
            })}
          >
            {post.title}
          </Typography>

          <PostTime createdAt={fDate(post.createdAt)} duration={post.duration} />
        </Box>
      </Box>
    </Link>
  );
}
