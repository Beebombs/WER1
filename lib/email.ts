import { Resend } from 'resend';
import { env } from '@/lib/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendConfirmationEmail(to: string) {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "We've received your pet video",
    text: "We’ve received your video, we’ll email your pet’s communication readout soon."
  });
}

export async function sendAdminPaidEmail(data: {
  petType: 'dog' | 'cat';
  email: string;
  videoUrl: string;
  submissionId: string;
  createdAt: string;
}) {
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: env.ADMIN_EMAIL,
    subject: `Paid submission ${data.submissionId}`,
    text: [
      `Pet type: ${data.petType}`,
      `Email: ${data.email}`,
      `Video: ${data.videoUrl}`,
      `Timestamp: ${data.createdAt}`,
      `Submission ID: ${data.submissionId}`
    ].join('\n')
  });
}
