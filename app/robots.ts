import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/session", "/replay/", "/reset-password", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

export default robots;
