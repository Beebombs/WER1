import Link from 'next/link';

export default function CancelPage() {
  return (
    <main>
      <div className="container card" style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ margin: 0 }}>Payment cancelled</h1>
        <p>No worries — your upload is saved as pending. You can retry payment now.</p>
        <Link href="/" className="button" style={{ width: 'fit-content' }}>Try again</Link>
      </div>
    </main>
  );
}
