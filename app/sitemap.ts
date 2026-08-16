import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/portfolio', '/visualizer', '/about', '/faq', '/contact'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${site.url}/portfolio/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }));

  return [...routes, ...projectRoutes];
}
