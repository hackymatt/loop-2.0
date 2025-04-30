import type { Metadata } from "next";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { LANGUAGE } from "src/consts/language";
import { courseQuery } from "src/api/course/course";

import { LearnView } from "src/sections/view/learn-view";

// ----------------------------------------------------------------------

export default function Page({ params }: { params: { course: string; lesson: string } }) {
  return <LearnView courseSlug={params.course} lessonSlug={params.lesson} />;
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; lesson: string };
}): Promise<Metadata> {
  try {
    const { queryFn } = courseQuery(params.course, LANGUAGE.PL);

    const { results: course } = await queryFn();

    const allLessons = course.chapters.flatMap((ch) => ch.lessons) ?? [];
    const lesson = allLessons.find((l) => l.slug === params.lesson);
    const title = `Lekcja ${lesson?.name}`;

    return createMetadata({
      title,
      path: `${paths.learn}/${params.course}/${params.lesson}`,
    });
  } catch {
    return createMetadata({
      title: "Nie znaleziono lekcji",
    });
  }
}
