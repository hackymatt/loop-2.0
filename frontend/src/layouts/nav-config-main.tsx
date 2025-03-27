import type { ICourseLevelProp } from "src/types/course";

import { useTranslation } from "react-i18next";

import { paths } from "src/routes/paths";

import { _courses } from "src/_mock";
import { useCourseLevels } from "src/api/course/level/levels";

// ----------------------------------------------------------------------

export const usePageLinks = () => {
  const { t } = useTranslation("navigation");
  const { data: courseLevels } = useCourseLevels({ sort_by: "order" });

  const technologies = [
    "React",
    "Angular",
    "Vue",
    "Bootstrap",
    "Node.js",
    "Laravel",
    "Ruby on Rails",
  ];
  const categories = ["Frontend", "Backend", "Full Stack", "DevOps", "Mobile App", "Desktop App"];

  const levelsSection = courseLevels?.length
    ? {
        subheader: t("levels"),
        items: courseLevels.map(({ slug, name }: ICourseLevelProp) => ({
          title: name,
          path: `${paths.courses}/?levels=${slug}`,
        })),
      }
    : null;

  const technologiesSection = {
    subheader: t("technologies"),
    items: technologies.map((technology: string) => ({
      title: technology,
      path: `${paths.courses}/?technologies=${technology}`,
    })),
  };

  const categoriesSection = {
    subheader: t("categories"),
    items: categories.map((category: string) => ({
      title: category,
      path: `${paths.courses}/?categories=${category}`,
    })),
  };

  const links = [];

  if (levelsSection) {
    links.push(levelsSection);
  }
  links.push(technologiesSection);
  links.push(categoriesSection);

  return links;
};

const useCourseNav = () => {
  const { t } = useTranslation("navigation");

  const popularCourses = _courses.slice(0, 4);

  const children = usePageLinks();

  return {
    moreLink: {
      title: t("more"),
      path: paths.courses,
    },
    tags: popularCourses.map((course) => ({
      title: course.title,
      path: `${paths.course}/${course.slug}/`,
    })),
    children,
  };
};
export const useNavData = () => {
  const { t } = useTranslation("navigation");
  const coursesNav = useCourseNav();
  return [
    { title: t("courses"), path: paths.pages, ...coursesNav },
    { title: t("pricing"), path: paths.pricing },
    { title: t("blog"), path: paths.posts },
    { title: t("about"), path: paths.about },
    { title: t("contact"), path: paths.contact },
  ];
};
