import type { MetadataRoute } from "next";

// Preview only: search engines stay out.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
