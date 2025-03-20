import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { PostsView } from "src/sections/view/posts-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata({
  title: "Blog",
  description:
    "Czytaj najnowsze artykuły o programowaniu, technologiach IT i najlepszych praktykach kodowania. Blog loop to wiedza dla początkujących i zaawansowanych!",
  path: paths.posts,
});

export default function Page() {
  return <PostsView />;
}
