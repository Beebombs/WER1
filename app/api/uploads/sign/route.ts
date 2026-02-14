import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { createSignedUploadUrl } from '@/lib/storage';

const bodySchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(['video/mp4', 'video/quicktime', 'video/webm']),
  fileSize: z.number().int().positive().max(25 * 1024 * 1024)
});

export async function POST(req: NextRequest) {
  try {
    const body = bodySchema.parse(await req.json());
    const extension = body.fileName.split('.').pop() || 'mp4';
    const key = `uploads/${Date.now()}-${randomUUID()}.${extension}`;
    const signed = await createSignedUploadUrl(key, body.contentType);

    return NextResponse.json({ key, ...signed });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid upload request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
