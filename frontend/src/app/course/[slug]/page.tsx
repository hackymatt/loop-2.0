import type { Metadata } from "next";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { LANGUAGE } from "src/consts/language";
import { courseQuery } from "src/api/course/course";

import { CourseView } from "src/sections/view/course-view";

// ----------------------------------------------------------------------
export default function Page({ params }: { params: { slug: string } }) {
  return <CourseView slug={params.slug} />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const { queryFn } = courseQuery(params.slug, LANGUAGE.PL);

    const { results: course } = await queryFn();

    const title = `Kurs ${course.name} - zacznij naukę już teraz`;
    const description = `Zdobądź praktyczne umiejętności programowania w ${course.technology.name} dzięki naszemu kursowi ${course.name}. Zarejestruj się i rozwijaj swoją karierę w IT!`;

    return createMetadata({ title, description, path: `${paths.course}/${params.slug}` });
  } catch {
    return createMetadata({
      title: "Nie znaleziono kursu",
      description: "Nie znaleziono kursu",
    });
  }
}
