# Pet Video Upload + £1 Payment MVP

Next.js MVP implementing:

- Dog/Cat selection
- Video upload via signed S3 URL (.mp4/.mov/.webm, max 25MB)
- £1 payment via Stripe Checkout (Apple Pay / Google Pay where available)
- Post-payment confirmation emails (user + admin) using Resend
- Stripe webhook-based payment confirmation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy envs and configure providers:
   ```bash
   cp .env.example .env.local
   ```
3. Create DB schema:
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Webhook

Use Stripe CLI in development:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then copy generated signing secret into `STRIPE_WEBHOOK_SECRET`.

## Flow

`/` → choose pet → `/upload?pet=dog|cat` → upload + email → Stripe Checkout → `/success`.

Payment status is marked as `paid` only in webhook (`checkout.session.completed`).
