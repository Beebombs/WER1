import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pet Video Upload',
  description: 'Upload a short pet video, pay £1, and receive a readout by email.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
