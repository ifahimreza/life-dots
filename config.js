/**
 * Global app configuration.
 * Each key explains how and why it is used so you can safely adjust it.
 */
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const config = {
	// Visible app name used in titles and UI.
	appName: 'Life in Dots',

	// Short tagline for metadata and social previews.
	appDescription:
		'Track the passage of time with a minimalist life dots view',

	// Primary brand color used in UI accents and PWA theme color.
	brandColor: '#3a8f7a',

	// Public app URL used for canonical links and auth callbacks.
	appUrl,

	// Support contact shown in emails or help links.
	supportEmail: process.env.SUPPORT_EMAIL ?? '',

	// Supabase configuration for auth and database access.
	supabase: {
		url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? ' ',
		anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
	},

	// Postmark configuration for transactional emails.
	postmark: {
		apiKey: process.env.POSTMARK_API_KEY ?? '',
		senderEmail: process.env.POSTMARK_SENDER_EMAIL ?? '',
	},

	// Authentication providers.
	auth: {
		google: {
			enabled: true,
		},
	},

	// Freemius configuration for payments and webhooks.
	freemius: {
		// Product ID from Freemius dashboard.
		productId: process.env.FREEMIUS_PRODUCT_ID ?? '',

		// API credentials from Freemius -> Settings -> API Keys.
		apiKey: process.env.FREEMIUS_API_KEY ?? '',
		secretKey: process.env.FREEMIUS_SECRET_KEY ?? '',
		publicKey: process.env.FREEMIUS_PUBLIC_KEY ?? '',

		// Optional: force Freemius sandbox mode.
		isSandbox: process.env.FREEMIUS_SANDBOX === 'true',

		// Plan IDs for each plan in Freemius.
		plans: {
			yearly: {
				id: 'yearly',
				name: 'Pro Yearly',
				price: 19,
				currency: 'USD',
				interval: 'year',
				planId: process.env.FREEMIUS_PLAN_ID_YEARLY ?? '',
			},
			lifetime: {
				id: 'lifetime',
				name: 'Pro Lifetime',
				price: 49,
				currency: 'USD',
				interval: 'lifetime',
				planId: process.env.FREEMIUS_PLAN_ID_LIFETIME ?? '',
			},
		},

		checkout: {
			successUrl: `${appUrl}/?checkout=success`,
			cancelUrl: `${appUrl}/?checkout=cancel`,
		},
	},
};

export default config;
