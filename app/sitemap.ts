import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://solanarefund.xyz/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
