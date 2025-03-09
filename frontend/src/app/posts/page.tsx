import { CONFIG } from "src/global-config";

import { PostsView } from "src/sections/view/posts-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Post list | E-learning - ${CONFIG.appName}` };

export default function Page() {
  return <PostsView />;
}
