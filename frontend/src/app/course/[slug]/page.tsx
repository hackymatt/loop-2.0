import type { Metadata } from "next";

import { createMetadata } from "src/utils/create-metadata";

import { CourseView } from "src/sections/view/course-view";

// ----------------------------------------------------------------------
export default function Page() {
  return <CourseView />;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const title = `Kurs ${params.slug} - zacznij naukę już teraz`;
  const description = `Zdobądź praktyczne umiejętności programowania w ${params.slug} dzięki naszemu kursowi ${params.slug}. Zarejestruj się i rozwijaj swoją karierę w IT!`;

  return createMetadata({ title, description, path: params.slug });
}
