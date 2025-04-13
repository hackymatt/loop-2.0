import type { ICourseLevelProp, ICourseTechnologyProp } from "src/types/course";

import { useTranslation } from "react-i18next";

import { paths } from "src/routes/paths";

import { PLAN_TYPE } from "src/consts/plan";
import { useFeaturedCourses } from "src/api/course/featured";
import { useCourseLevels } from "src/api/course/level/levels";
import { useCourseCategories } from "src/api/course/category/categories";
import { useCourseTechnologies } from "src/api/course/technology/technologies";

import { useUserContext } from "src/components/user";

// ----------------------------------------------------------------------

export const usePageLinks = () => {
  const { t } = useTranslation("navigation");
  const { data: courseLevels } = useCourseLevels({ sort_by: "order", page_size: "-1" });
  const { data: courseTechnologies } = useCourseTechnologies({ page_size: "-1" });
  const { data: courseCategories } = useCourseCategories({ page_size: "-1" });

  const levelsSection = courseLevels?.length
    ? {
        subheader: t("levels"),
        items: courseLevels.map(({ slug, name }: ICourseLevelProp) => ({
          title: name,
          path: `${paths.courses}?levels=${slug}`,
        })),
      }
    : null;

  const technologiesSection = courseTechnologies?.length
    ? {
        subheader: t("technologies"),
        items: courseTechnologies.map(({ slug, name }: ICourseTechnologyProp) => ({
          title: name,
          path: `${paths.courses}?technologies=${slug}`,
        })),
      }
    : null;

  const categoriesSection = courseCategories?.length
    ? {
        subheader: t("categories"),
        items: courseCategories.map(({ slug, name }: ICourseTechnologyProp) => ({
          title: name,
          path: `${paths.courses}?categories=${slug}`,
        })),
      }
    : null;

  const links = [];

  if (levelsSection) {
    links.push(levelsSection);
  }
  if (technologiesSection) {
    links.push(technologiesSection);
  }
  if (categoriesSection) {
    links.push(categoriesSection);
  }

  return links;
};

const useCourseNav = () => {
  const { t } = useTranslation("navigation");

  const { data: featuredCourses } = useFeaturedCourses();

  const children = usePageLinks();

  return {
    moreLink: {
      title: t("more"),
      path: paths.courses,
    },
    tags: (featuredCourses || []).map((course) => ({
      title: course.name,
      path: `${paths.course}/${course.slug}`,
    })),
    children,
  };
};
export const useNavData = () => {
  const { t } = useTranslation("navigation");
  const user = useUserContext();
  const { isLoggedIn, plan } = user.state;

  const coursesNav = useCourseNav();

  return isLoggedIn
    ? [
        { title: t("courses"), path: paths.courses, ...coursesNav },
        { title: t("certificates"), path: paths.certificates, disabled: plan === PLAN_TYPE.FREE },
        { title: t("blog"), path: paths.posts },
        { title: t("contact"), path: paths.contact },
      ]
    : [
        { title: t("courses"), path: paths.courses, ...coursesNav },
        { title: t("pricing"), path: paths.pricing },
        { title: t("blog"), path: paths.posts },
        { title: t("about"), path: paths.about },
        { title: t("contact"), path: paths.contact },
      ];
};
