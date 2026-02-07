import type { MetadataRoute } from 'next';
import config from '../config';

const baseUrl = config.appUrl?.replace(/\/$/, '') || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: '*',
				allow: ['/', '/privacy', '/terms'],
				disallow: [
					'/app',
					'/dashboard',
					'/settings',
					'/onboarding',
					'/login',
					'/admin',
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
