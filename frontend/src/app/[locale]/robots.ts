import type { MetadataRoute } from "next";

import { CONFIG } from "src/global-config";

export default function robots(): MetadataRoute.Robots {
  const { env: ENV } = CONFIG;
  const env = ENV === "PROD" ? "" : `${ENV.toLocaleLowerCase()}.`;

  const allRules = { userAgent: "*", disallow: "/" };
  const prodRules = {
    userAgent: ["Googlebot", "Applebot", "Bingbot"],
    allow: ["/"],
    disallow: ["/_next"],
  };

  const rules = ENV === "PROD" ? [prodRules, allRules] : [allRules];

  return {
    rules,
    sitemap: `https://${env}loop.edu.pl/sitemap.xml`,
  };
}
