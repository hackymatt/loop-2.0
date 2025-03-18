import { createMetadata } from "src/utils/create-metadata";

import { PostsView } from "src/sections/view/posts-view";

// ----------------------------------------------------------------------

export const metadata = createMetadata(
  "Blog",
  "Czytaj najnowsze artykuły o programowaniu, technologiach IT i najlepszych praktykach kodowania. Blog loop to wiedza dla początkujących i zaawansowanych!"
);

export default function Page() {
  return <PostsView />;
}
