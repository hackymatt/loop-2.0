import type { Variants } from "framer-motion";
import type { IPostProps } from "src/types/blog";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";

import { Container } from "@mui/material";

import { varFade, MotionViewport } from "src/components/animate";

import { LatestPosts } from "../posts/latest-posts";

// ----------------------------------------------------------------------

const variants: Variants = varFade("inUp", { distance: 24 });

type Props = BoxProps & {
  posts: IPostProps[];
};

export function HomeLatestPosts({ posts, sx, ...other }: Props) {
  return (
    <Container component={MotionViewport}>
      <m.div variants={variants}>
        <LatestPosts largePost={posts[0]} smallPosts={posts.slice(1, 5)} sx={sx} {...other} />
      </m.div>
    </Container>
  );
}
