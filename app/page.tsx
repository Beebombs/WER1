import Link from 'next/link';
import { PetCard } from '@/components/pet-card';

export default function HomePage() {
  return (
    <main>
      <div className="container" style={{ display: 'grid', gap: '1rem' }}>
        <section className="card">
          <h1 style={{ marginTop: 0 }}>Upload a 5-second clip. Get a read on what your pet is saying.</h1>
          <p className="small">No account needed. £1 one-off. We&apos;ll email your response.</p>
        </section>

        <section className="grid-2">
          <PetCard pet="dog" icon="🐶" />
          <PetCard pet="cat" icon="🐱" />
        </section>

        <footer className="small" style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </div>
    </main>
  );
}
