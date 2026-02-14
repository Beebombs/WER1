import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { stripe } from '@/lib/stripe';
import { pool } from '@/lib/db';
import { sendAdminPaidEmail, sendConfirmationEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const submissionId = session.metadata?.submissionId;

      if (!submissionId) {
        return NextResponse.json({ received: true });
      }

      const result = await pool.query(
        `update submissions
         set payment_status = 'paid'
         where id = $1
         returning id, pet_type, email, video_url, created_at`,
        [submissionId]
      );

      if (result.rowCount) {
        const row = result.rows[0] as {
          id: string;
          pet_type: 'dog' | 'cat';
          email: string;
          video_url: string;
          created_at: string;
        };

        await Promise.all([
          sendConfirmationEmail(row.email),
          sendAdminPaidEmail({
            petType: row.pet_type,
            email: row.email,
            videoUrl: row.video_url,
            submissionId: row.id,
            createdAt: row.created_at
          })
        ]);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Webhook failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
