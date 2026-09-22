import type { MetadataRoute } from "next";
import { communitiesDetailData } from "@/data/communitiesDetailData";

export default function sitemap(): MetadataRoute.Sitemap {
  const isProduction = process.env.APP_ENV === "production";

  if (!isProduction) {
    return [];
  }

  const baseUrl = "https://paroquiasaojosecaragua.org.br";
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/agenda`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/liturgia`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comunidades`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/clerigos`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/quero-contribuir`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const communityRoutes: MetadataRoute.Sitemap = Object.keys(
    communitiesDetailData
  ).map((slug) => ({
    url: `${baseUrl}/comunidades/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...communityRoutes];
}
