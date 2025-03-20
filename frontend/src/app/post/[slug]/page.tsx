import type { Metadata } from "next";

import { createMetadata } from "src/utils/create-metadata";

import { PostView } from "src/sections/view/post-view";

// ----------------------------------------------------------------------

export default function Page() {
  return <PostView />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const title = `${params.slug} - przeczytaj artykuł już teraz`;
  const description = `Przeczytaj nasz artykuł pod tytułem ${params.slug}. Odkryj praktyczne porady i najlepsze praktyki, które pomogą Ci w rozwoju umiejętności programistycznych.`;
  const coverUrl = "";

  return createMetadata({ title, description, path: params.slug, image: coverUrl });
}
