import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://solanarefund.xyz/",
      lastModified: new Date("2026-05-08"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
