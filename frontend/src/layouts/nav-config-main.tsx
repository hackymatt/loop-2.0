import { useTranslation } from "react-i18next";

import { paths } from "src/routes/paths";

import { _courses } from "src/_mock";

// ----------------------------------------------------------------------

export const usePageLinks = () => {
  const { t } = useTranslation("navigation");

  const levels = ["Beginner", "Intermediate", "Advanced"];
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

  return [
    {
      subheader: t("levels"),
      items: levels.map((level: string) => ({
        title: level,
        path: `${paths.courses}/?levels=${level}`,
      })),
    },
    {
      subheader: t("technologies"),
      items: technologies.map((technology: string) => ({
        title: technology,
        path: `${paths.courses}/?technologies=${technology}`,
      })),
    },
    {
      subheader: t("categories"),
      items: categories.map((category: string) => ({
        title: category,
        path: `${paths.courses}/?categories=${category}`,
      })),
    },
  ];
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
