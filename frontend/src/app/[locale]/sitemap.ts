import type { MetadataRoute } from "next";

import { paths } from "src/routes/paths";

import { CONFIG } from "src/global-config";

async function fetchData(env: string) {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { env: ENV } = CONFIG;
  const env = ENV === "PROD" ? "" : `${ENV.toLocaleLowerCase()}.`;

  const dynamicRoutes = await fetchData(env);

  const staticRoutes = [
    {
      url: `https://${env}loop.edu.pl`,
      lastModified: new Date().toISOString(),
      changeFrequency: "always" as const,
      priority: 1,
    },
    {
      url: `https://${env}loop.edu.pl${paths.courses}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "always" as const,
      priority: 0.9,
    },
    {
      url: `https://${env}loop.edu.pl${paths.posts}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "always" as const,
      priority: 0.8,
    },
    {
      url: `https://${env}loop.edu.pl${paths.about}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `https://${env}loop.edu.pl${paths.contact}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `https://${env}loop.edu.pl${paths.login}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: `https://${env}loop.edu.pl${paths.register}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: `https://${env}loop.edu.pl${paths.resetPassword}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.9,
    },
    {
      url: `https://${env}loop.edu.pl${paths.support}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `https://${env}loop.edu.pl${paths.privacyPolicy}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `https://${env}loop.edu.pl${paths.termsAndConditions}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
