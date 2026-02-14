import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/lib/db';
import { rateLimit } from '@/lib/ratelimit';

const bodySchema = z.object({
  petType: z.enum(['dog', 'cat']),
  email: z.string().email(),
  videoKey: z.string().min(1),
  videoUrl: z.string().url(),
  videoMime: z.enum(['video/mp4', 'video/quicktime', 'video/webm']),
  videoSize: z.number().int().positive().max(25 * 1024 * 1024),
  originalFilename: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for') || 'unknown';

    if (rateLimit) {
      const { success } = await rateLimit.limit(`submissions:${forwardedFor}`);
      if (!success) {
        return NextResponse.json({ error: 'Too many submissions, please wait and try again.' }, { status: 429 });
      }
    }

    const body = bodySchema.parse(await req.json());

    const result = await pool.query(
      `insert into submissions (pet_type, email, video_url, video_key, video_mime, video_size, original_filename, payment_status)
       values ($1, $2, $3, $4, $5, $6, $7, 'pending')
       returning id`,
      [body.petType, body.email, body.videoUrl, body.videoKey, body.videoMime, body.videoSize, body.originalFilename]
    );

    return NextResponse.json({ id: result.rows[0].id as string });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid submission request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
