---
name: dotspan-saas-boilerplate
description: Scaffold or refactor a Next.js App Router SaaS boilerplate with Supabase authentication (Magic Link and Google OAuth), Freemius billing, Turnstile-protected forms, Postmark email helpers, SEO defaults from config.js, and strict private/public route boundaries. Use when building a new starter, auditing an existing boilerplate, or implementing missing auth/payment/email/SEO foundations in a Next.js app.
---

# Dotspan Saas Boilerplate

## Overview

Implement a production-ready SaaS foundation for Next.js App Router projects.
Enforce a predictable structure, secure auth boundaries, payment wiring, and deploy-safe environment handling.

## Workflow

1. Audit current structure and map pages into `public` and `private`.
2. Enforce auth flow and middleware protection before feature work.
3. Wire Supabase profiles and access model.
4. Wire Freemius checkout/webhook/portal and access sync.
5. Wire email stack: SMTP for auth and Postmark helper for app emails.
6. Add Turnstile for login/contact endpoints that accept anonymous traffic.
7. Verify SEO defaults, metadata, and crawl files.
8. Validate with local build and targeted runtime checks.

## Required Project Contract

Keep this layout and naming unless the user explicitly requests a different convention:

- `/app` pages and layouts
- `/app/api` route handlers (`route.js` or `route.ts`)
- `/components` reusable UI
- `/libs` helpers (auth, api, email, billing, seo)
- `config.js` as the main app configuration source
- `.env.local` for local secrets
- `.env.example` for placeholders only

## Authentication and Access

Implement and keep both:

1. Supabase Magic Link login.
2. Supabase Google OAuth login.

Enforce these rules:

1. Anonymous users cannot access private routes (`/dashboard`, `/settings`, `/billing`, `/account`, `/admin`).
2. Authenticated users should be redirected away from `/login` when appropriate.
3. `has_access` from `profiles` controls paid feature access.
4. Billing UI should not be shown as an upgrade screen to users who already have access.

Use middleware plus server-side checks on sensitive routes.

## API Pattern

For client API calls, use `/libs/api.js` (axios instance) with interceptors:

1. Normalize and display API errors.
2. Redirect to `/login` on HTTP `401`.

For route handlers in `/app/api`, keep handlers server-only and avoid exposing secrets to client bundles.

## Supabase Schema and Policies

Run and adapt `references/profiles.sql` in Supabase SQL Editor.
Use it to create:

1. `profiles` table linked to `auth.users`.
2. `has_access` and customer/subscription fields for Freemius sync.
3. RLS policies so users can only read/update their own profile fields.

## Email Stack

Use two channels:

1. Supabase/SMTP for auth emails (magic links).
2. Postmark API helper in `/libs/postmark.js` for product emails.

Keep email-sending logic server-side only.

## Freemius Billing

Implement:

1. Checkout creation endpoint.
2. Portal endpoint (billing/subscription info).
3. Webhook endpoint that updates profile access state.

Store Freemius IDs in `profiles` and make access decisions from `profiles.has_access`.

## SEO and Metadata

Set defaults in `config.js`:

1. `appName`
2. `appDescription`
3. `domainName`

Use `/libs/seo.js` helpers in `/app/layout.js` and high-value pages.
Keep `robots` and `sitemap` aligned with route visibility.

## Error Surfaces

Provide and maintain:

1. `/app/error.js`
2. `/app/not-found.js`

Each should present clear recovery actions and support entrypoint (for example via `ButtonSupport`).

## Environment Rules

Read `references/env-vars.md` and enforce:

1. Only `NEXT_PUBLIC_*` variables appear in client code.
2. Secrets stay server-only.
3. `.env.local` is ignored by git.
4. `.env.example` contains keys but never real values.

## Done Criteria

Complete only when all checks pass:

1. `npm run build` succeeds.
2. Unauthenticated user is blocked from private pages.
3. Authenticated user lands on private pages correctly.
4. Billing webhook path updates profile access correctly.
5. Contact/login anti-spam validation works with Turnstile configured.
6. SEO defaults are visible in metadata output.
