import { paths } from "src/routes/paths";

import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
};

export const createMetadata = ({
  title = "Programowanie na wyciągniecie ręki z loop",
  description = "Ucz się programowania szybciej z AI, interaktywnymi kursami i wsparciem mentorów.",
  keywords = [
    // Ogólne
    "kursy programowania",
    "nauka programowania",
    "szkoła programowania",
    "platforma edukacyjna",
    "certyfikaty programistyczne",

    // Technologie
    "JavaScript",
    "Python",
    "SQL",
    "VBA",
    "R",
    "React",
    "Next.js",
    "Node.js",
    "Docker",
    "Kubernetes",
    "Google Cloud",
    "AWS",
    "Git",
    "Selenium",
    "Nginx",

    // Kursy i szkolenia
    "kurs JavaScript",
    "kurs Python",
    "kurs SQL",
    "kurs React",
    "kurs Next.js",
    "kurs Node.js",
    "kurs Docker",
    "kurs Kubernetes",
    "kurs VBA",
    "kurs R",
    "kurs Git",
    "kurs Selenium",
    "kurs Nginx",
    "szkolenie IT",
    "bootcamp programistyczny",

    // Web development
    "frontend",
    "backend",
    "full-stack",
    "Tworzenie aplikacji webowych",
    "REST API",
    "GraphQL",

    // Automatyzacja i testowanie
    "testowanie automatyczne",
    "automatyzacja procesów",
    "web scraping",
    "testy Selenium",
    "testowanie aplikacji",

    // Dodatkowe
    "praca w IT",
    "zdalna praca programisty",
    "freelancing IT",
    "programowanie od podstaw",
    "kariera w IT",
    "kursy online",
    "nauka kodowania",
  ],
  path,
  image,
}: Props) => {
  const location = path || paths.home;

  const { appName: name } = CONFIG;

  return {
    title: `${title} • ${name}`,
    description,
    keywords: keywords.join(","),
    alternates: {
      canonical: `https://loop.edu.pl${location}`,
    },
    openGraph: {
      type: "website",
      url: `https://loop.edu.pl${location}`,
      images: image ?? "https://loop.edu.pl/logo/logo.svg",
      title: `${title} • ${name}`,
      description,
    },
  };
};
