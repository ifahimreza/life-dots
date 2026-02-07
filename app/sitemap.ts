import type {MetadataRoute} from "next";
import config from "../config";

const baseUrl = config.appUrl?.replace(/\/$/, "") || "http://localhost:3000";
const publicRoutes = ["/", "/privacy", "/terms", "/refund"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7
  }));
}
