/**
 * Global app configuration.
 * Each key explains how and why it is used so you can safely adjust it.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const domainName =
	process.env.NEXT_PUBLIC_DOMAIN ??
	(() => {
		try {
			return new URL(appUrl).host;
		} catch {
			return appUrl;
		}
	})();

const config = {
	// Visible app name used in titles and UI.
	appName: 'DotSpan',

	// Short tagline for metadata and social previews.
	appDescription:
		'DotSpan helps you visualize Your Life in Weeks with a clean dot timeline for perspective, focus, and accountability.',

	// Primary brand color used in UI accents and PWA theme color.
	brandColor: '#00c565',

	// Public app URL used for canonical links and auth callbacks.
	appUrl,

	// Root domain (no protocol) used for SEO.
	domainName,

	// Support contact shown in emails or help links.
	supportEmail: process.env.SUPPORT_EMAIL ?? '',

	// Supabase public configuration for auth and database access.
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
	},

	// Authentication providers.
	auth: {
		google: {
			enabled: true,
		},
	},

	// Public pricing metadata used by UI.
	freemius: {
		plan: {
			id: 'plus',
			name: 'DotSpan Plus',
		},
		pricing: {
			monthly: {
				id: 'monthly',
				name: 'Plus Monthly',
				price: Number(process.env.NEXT_PUBLIC_FREEMIUS_PRICE_MONTHLY ?? 4),
				currency: 'USD',
				interval: 'month',
			},
			yearly: {
				id: 'yearly',
				name: 'Plus Yearly',
				price: Number(process.env.NEXT_PUBLIC_FREEMIUS_PRICE_YEARLY ?? 18),
				currency: 'USD',
				interval: 'year',
			},
			lifetime: {
				id: 'lifetime',
				name: 'Plus Lifetime',
				price: Number(process.env.NEXT_PUBLIC_FREEMIUS_PRICE_LIFETIME ?? 48),
				currency: 'USD',
				interval: 'lifetime',
			},
		},
	},
};

export default config;
