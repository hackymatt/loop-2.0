import type { Metadata } from "next";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { LearnView } from "src/sections/view/learn-view";

// ----------------------------------------------------------------------

export default function Page({
  params,
}: {
  params: { course: string; chapter: string; lesson: string };
}) {
  return <LearnView course={params.course} chapter={params.chapter} lesson={params.lesson} />;
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; chapter: string; lesson: string };
}): Promise<Metadata> {
  try {
    // const { queryFn } = courseQuery(params.slug, LANGUAGE.PL);

    // const { results: course } = await queryFn();

    const title = `Lekcja ${params.lesson}`;

    return createMetadata({
      title,
      path: `${paths.learn}/${params.course}/${params.chapter}/${params.lesson}`,
    });
  } catch {
    return createMetadata({
      title: "Nie znaleziono lekcji",
      description: "Nie znaleziono lekcji",
    });
  }
}
