import type { Metadata } from "next";
import type { ICourseLessonProp, ICourseChapterProp } from "src/types/course";

import { paths } from "src/routes/paths";

import { createMetadata } from "src/utils/create-metadata";

import { URLS } from "src/api/urls";
import { CONFIG } from "src/global-config";
import { LANGUAGE } from "src/consts/language";

import { LearnView } from "src/sections/view/learn-view";

// ----------------------------------------------------------------------

export default function Page({ params }: { params: { course: string; lesson: string } }) {
  return <LearnView courseSlug={params.course} lessonSlug={params.lesson} />;
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; course: string; lesson: string };
}): Promise<Metadata> {
  const translations = await import(`public/locales/${params.locale}/learn.json`);

  const path = params.locale === LANGUAGE.PL ? paths.learn : `/${LANGUAGE.EN}${paths.learn}`;
  try {
    const res = await fetch(`${CONFIG.api}${URLS.COURSES}/${params.course}`, {
      headers: { "Content-Type": "application/json", "Accept-Language": params.locale },
    });

    if (!res.ok) throw new Error("Failed to fetch course");

    const course = await res.json();

    const { chapters } = course;

    const allLessons = chapters.flatMap((ch: ICourseChapterProp) => ch.lessons) ?? [];
    const lesson = allLessons.find((l: ICourseLessonProp) => l.slug === params.lesson);

    const title = translations.meta.title.replace("[name]", lesson.name);
    const description = translations.meta.post.description.replace("[name]", lesson.name);

    return createMetadata({
      title,
      description,
      path: `${path}/${params.course}/${params.lesson}`,
    });
  } catch {
    return createMetadata({
      title: translations.meta.post.title,
      description: translations.meta.post.description,
      path: `${path}/${params.course}/${params.lesson}`,
    });
  }
}
