import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { pool } from '@/lib/db';
import { stripe } from '@/lib/stripe';

const bodySchema = z.object({
  submissionId: z.string().uuid()
});

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());

    const existing = await pool.query('select id, payment_status from submissions where id = $1 limit 1', [body.submissionId]);
    if (!existing.rowCount) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${env.APP_URL}/success?submission=${body.submissionId}`,
      cancel_url: `${env.APP_URL}/cancel`,
      metadata: { submissionId: body.submissionId }
    });

    await pool.query('update submissions set stripe_session_id = $1 where id = $2', [session.id, body.submissionId]);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not create checkout session';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
