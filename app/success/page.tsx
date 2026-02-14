import Link from 'next/link';

export default function SuccessPage({ searchParams }: { searchParams: { submission?: string } }) {
  return (
    <main>
      <div className="container card" style={{ display: 'grid', gap: '0.5rem' }}>
        <h1 style={{ margin: 0 }}>Thank you!</h1>
        <p>We&apos;ve got it. We&apos;ll email your pet&apos;s readout soon.</p>
        {searchParams.submission ? <p className="small">Submission ID: {searchParams.submission}</p> : null}
        <Link href="/" className="button" style={{ width: 'fit-content' }}>Submit another</Link>
      </div>
    </main>
  );
}
