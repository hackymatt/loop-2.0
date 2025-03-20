import { orderBy } from "es-toolkit";

// ----------------------------------------------------------------------

export type NavItemData = {
  name: string;
  href: string;
};

const allComponents: NavItemData[] = [
  { name: "Animate", href: "/components/animate" },
  { name: "Carousel", href: "/components/carousel" },
  { name: "Utilities", href: "/components/utilities" },
  { name: "Form validation", href: "/components/form-validation" },
  { name: "Form wizard", href: "/components/form-wizard" },
  { name: "Icons", href: "/components/icons" },
  { name: "Image", href: "/components/image" },
  { name: "Label", href: "/components/label" },
  { name: "Lightbox", href: "/components/lightbox" },
  { name: "Markdown", href: "/components/markdown" },
  { name: "Mega menu", href: "/components/mega-menu" },
  { name: "Navigation bar", href: "/components/navigation-bar" },
  { name: "Scrollbar", href: "/components/scroll" },
  { name: "Scroll progress", href: "/components/scroll-progress" },
  { name: "Player", href: "/components/player" },
];

export const navData: NavItemData[] = orderBy(allComponents, ["name"], ["asc"]);
