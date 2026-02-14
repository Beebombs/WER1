import Link from 'next/link';

export function PetCard({ pet, icon }: { pet: 'dog' | 'cat'; icon: string }) {
  return (
    <Link href={`/upload?pet=${pet}`} className="card" style={{ textDecoration: 'none' }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <h3 style={{ marginTop: '0.5rem', textTransform: 'capitalize' }}>{pet}</h3>
      <p className="small">Choose {pet} and upload your clip.</p>
    </Link>
  );
}
