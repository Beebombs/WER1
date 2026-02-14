import { Pool } from 'pg';
import { env } from '@/lib/env';

export const pool = new Pool({ connectionString: env.DATABASE_URL });

export type Submission = {
  id: string;
  pet_type: 'dog' | 'cat';
  email: string;
  video_url: string;
  video_key: string;
  video_mime: string;
  video_size: number;
  original_filename: string;
  payment_status: 'pending' | 'paid' | 'failed';
  stripe_session_id: string | null;
  created_at: string;
};
