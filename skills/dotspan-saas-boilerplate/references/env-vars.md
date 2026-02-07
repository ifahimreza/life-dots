# Environment Variables Checklist

## Public (client-safe)

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_DOMAIN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_FREEMIUS_PRICE_YEARLY` (optional display override)
- `NEXT_PUBLIC_FREEMIUS_PRICE_LIFETIME` (optional display override)

## Server-only (secret)

- `SUPABASE_SERVICE_ROLE_KEY`
- `TURNSTILE_SECRET_KEY`
- `POSTMARK_API_KEY`
- `POSTMARK_SENDER_EMAIL`
- `FREEMIUS_PRODUCT_ID`
- `FREEMIUS_API_KEY`
- `FREEMIUS_SECRET_KEY`
- `FREEMIUS_PUBLIC_KEY`
- `FREEMIUS_SANDBOX`
- `FREEMIUS_PLAN_ID_YEARLY`
- `FREEMIUS_PLAN_ID_LIFETIME`
- `SUPPORT_EMAIL`

## Deployment Rules

1. Keep `.env.local` local only and git-ignored.
2. Commit `.env.example` with placeholders only.
3. Set production values in deployment platform environment settings.
4. Never import server-only values into client components.
5. Fail fast with clear errors when required env vars are missing.
