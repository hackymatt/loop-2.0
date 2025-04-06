import type { Metadata } from "next";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { postQuery } from "src/api/blog/post";
import { LANGUAGE } from "src/consts/language";

import { PostView } from "src/sections/view/post-view";

// ----------------------------------------------------------------------

export default function Page({ params }: { params: { slug: string } }) {
  return <PostView slug={params.slug} />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { queryFn } = postQuery(params.slug, LANGUAGE.PL);

  const { results: post } = await queryFn();
  const title = `${post.name} - przeczytaj artykuł już teraz`;
  const description = `Przeczytaj nasz artykuł pod tytułem ${post.name}. Odkryj praktyczne porady i najlepsze praktyki, które pomogą Ci w rozwoju umiejętności programistycznych.`;
  const coverUrl = post.heroUrl;

  return createMetadata({
    title,
    description,
    path: `${paths.post}/${params.slug}`,
    image: coverUrl,
  });
}
