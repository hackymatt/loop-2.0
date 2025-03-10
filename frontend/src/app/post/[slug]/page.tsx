import { CONFIG } from "src/global-config";

import { PostView } from "src/sections/view/post-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Post details | E-learning - ${CONFIG.appName}` };

export default function Page() {
  return <PostView />;
}
